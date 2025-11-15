export default function Loading() {
  return (
    <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        {/* Rotating Injection Icon */}
        <div className="relative w-24 h-24 mx-auto">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-accent-primary/20 rounded-full animate-spin"></div>
          <div
            className="absolute inset-2 border-4 border-t-accent-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
            style={{ animationDuration: "0.8s" }}
          ></div>

          {/* Center injection icon with pulse animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 gradient-warm rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
              <i className="fas fa-syringe text-3xl text-white transform rotate-45"></i>
            </div>
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div
            className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
