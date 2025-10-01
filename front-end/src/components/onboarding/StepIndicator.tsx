import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-primary-500 text-black'
                    : isCurrent
                    ? 'bg-primary-500 text-black'
                    : 'bg-secondary-200 text-secondary-600'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              
              {index < totalSteps - 1 && (
                <div
                  className={`w-12 md:w-20 h-1 mx-2 transition-colors ${
                    isCompleted ? 'bg-primary-500' : 'bg-secondary-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="text-center">
        <h2 className="text-xl font-bold text-secondary-900 mb-1">
          {stepTitles[currentStep - 1]}
        </h2>
        <p className="text-sm text-secondary-600">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
}