// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title CeloSoulPayments
/// @notice Handles tipping and subscription purchases in cUSD with a configurable platform fee.
/// @dev Uses ERC20 transferFrom pattern. Caller must approve this contract for the required amount.
///
/// Security: uses ReentrancyGuard patterns through checks-effects-interactions and SafeERC20 from OZ.

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";

interface IERC20Decimals {
    function decimals() external view returns (uint8);
}

contract CeloSoulPayments is Context, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // cUSD token used for payments (set at deployment or via setter)
    IERC20 public immutable cusd;

    // platform fee (in token smallest unit, e.g., for cUSD decimals=18)
    // This is a fixed fee per transaction that the platform collects (e.g., $0.50)
    uint256 public platformFee; 

    // accumulated fees (token balance stored here)
    uint256 public accumulatedFees;

    // subscription tiers
    struct Tier {
        uint256 price;      // price in token smallest unit (cUSD wei)
        uint256 duration;   // duration in seconds
        bool exists;
    }
    mapping(uint8 => Tier) public tiers;

    // user subscriptions: expiry timestamp (unix). expiry > block.timestamp => active
    mapping(address => uint256) public subscriptionExpiry;

    // events
    event TipSent(address indexed from, address indexed to, uint256 grossAmount, uint256 fee, uint256 netAmount, uint256 timestamp);
    event SubscriptionPurchased(address indexed buyer, uint8 indexed tierId, uint256 price, uint256 expiry, uint256 timestamp);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event TierUpdated(uint8 indexed tierId, uint256 price, uint256 duration);
    event FeesWithdrawn(address indexed to, uint256 amount);

    /// @param _cusd address of cUSD token (ERC20) — use testnet/mainnet address accordingly
    /// @param _platformFee initial platform fee in token units (e.g., 0.5 * 1e18 for cUSD)
    constructor(IERC20 _cusd, uint256 _platformFee) {
        require(address(_cusd) != address(0), "cUSD address zero");
        cusd = _cusd;
        platformFee = _platformFee;
    }

    // ----------------------
    // ADMIN / OWNER actions
    // ----------------------

    /// @notice Set platform fee (in token smallest units). Only owner.
    function setPlatformFee(uint256 _newFee) external onlyOwner {
        uint256 old = platformFee;
        platformFee = _newFee;
        emit PlatformFeeUpdated(old, _newFee);
    }

    /// @notice Add or update a subscription tier
    function setTier(uint8 _tierId, uint256 _price, uint256 _duration) external onlyOwner {
        tiers[_tierId] = Tier({ price: _price, duration: _duration, exists: true });
        emit TierUpdated(_tierId, _price, _duration);
    }

    /// @notice Owner withdraws accumulated fees to `to` address
    function withdrawFees(address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "zero address");
        require(amount <= accumulatedFees, "insufficient fees");
        accumulatedFees -= amount;
        cusd.safeTransfer(to, amount);
        emit FeesWithdrawn(to, amount);
    }

    // ----------------------
    // USER actions
    // ----------------------

    /// @notice Tip another user. Caller must approve `amount` to this contract beforehand.
    /// @param to recipient address
    /// @param grossAmount amount caller wants to send (in token wei). Must be > platformFee.
    function tip(address to, uint256 grossAmount) external nonReentrant {
        require(to != address(0), "invalid recipient");
        require(grossAmount > platformFee, "amount <= platform fee");

        // Pull tokens from sender
        address from = _msgSender();
        cusd.safeTransferFrom(from, address(this), grossAmount);

        // compute fee & net
        uint256 fee = platformFee;
        uint256 net = grossAmount - fee;

        // accumulate fee
        accumulatedFees += fee;

        // Send net to recipient
        cusd.safeTransfer(to, net);

        emit TipSent(from, to, grossAmount, fee, net, block.timestamp);
    }

    /// @notice Purchase subscription tier. Caller must approve price. Credits user's subscription expiry.
    /// @param tierId id of tier (uint8)
    function purchaseSubscription(uint8 tierId) external nonReentrant {
        Tier memory t = tiers[tierId];
        require(t.exists, "tier not set");

        address buyer = _msgSender();
        uint256 price = t.price;
        require(price > 0, "price zero");

        // Transfer price from buyer
        cusd.safeTransferFrom(buyer, address(this), price);

        // platform fee first (if price <= platformFee treat as fee only)
        uint256 fee = platformFee;
        uint256 netToPlatform = 0;
        if (price >= fee) {
            // price covers the fee: platform keeps fee, rest remains in contract as credits or used later
            accumulatedFees += fee;

            // The rest can be considered "flushed" to the platform as well or kept for future logic.
            // For simplicity we keep the rest in contract balance (accumulatedFees) so owner can withdraw.
            netToPlatform = price - fee;
            accumulatedFees += netToPlatform;
        } else {
            // price smaller than fee - still accept but everything goes to fees
            accumulatedFees += price;
            netToPlatform = 0;
        }

        // extend subscription. If already active, extend; otherwise set new expiry
        uint256 currentExpiry = subscriptionExpiry[buyer];
        uint256 base = block.timestamp > currentExpiry ? block.timestamp : currentExpiry;
        uint256 newExpiry = base + t.duration;
        subscriptionExpiry[buyer] = newExpiry;

        emit SubscriptionPurchased(buyer, tierId, price, newExpiry, block.timestamp);
    }

    // ----------------------
    // VIEW helpers
    // ----------------------

    /// @notice Check whether an address currently has an active subscription
    function hasActiveSubscription(address user) external view returns (bool) {
        return subscriptionExpiry[user] > block.timestamp;
    }

    /// @notice Get subscription expiry for a user (0 if none)
    function subscriptionExpiryOf(address user) external view returns (uint256) {
        return subscriptionExpiry[user];
    }

    /// @notice Owner can recover any ERC20 mistakenly sent (except cUSD)
    function recoverERC20(IERC20 token, address to, uint256 amount) external onlyOwner {
        require(address(token) != address(cusd), "cannot recover cUSD");
        token.safeTransfer(to, amount);
    }
}
