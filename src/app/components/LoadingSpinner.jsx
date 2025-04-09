export default function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center mt-8">
        <div className="w-12 h-12 border-4 border-white border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }