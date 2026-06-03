const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center z-[9999]">
      <div className="relative w-20 h-20 mb-8">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
        
        {/* Inner static/pulsing logo placeholder */}
        <div className="absolute inset-4 bg-gradient-to-br from-primary to-purple rounded-lg shadow-glow flex items-center justify-center text-xl text-white font-bold animate-pulse">
          A
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-text-primary font-bold text-xl tracking-tight mb-2">Admin Dashboard</h2>
        <div className="flex items-center gap-1 justify-center">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
        </div>
        <p className="text-text-muted text-sm mt-4 font-medium uppercase tracking-widest">Initialising System</p>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </div>
  );
};

export default PageLoader;
