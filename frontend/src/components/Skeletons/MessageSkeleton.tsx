const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(4).fill(null);

  return (
    <div className="flex flex-col h-full">
      {/* Top navbar skeleton */}
      <div className="h-20 px-8 flex items-center gap-4 border-b border-base-300 bg-base-100/80 rounded-tr-2xl">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
      {/* Messages skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
        {skeletonMessages.map((_, idx) => (
          <div
            key={idx}
            className={`flex ${
              idx % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <div className="max-w-[70%]">
              <div className="skeleton h-12 w-full rounded-xl mb-2" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSkeleton;
