import { FlickeringGrid } from "../FlickeringGrid";

const MessageSkeleton = () => {
  const skeletonMessages = Array(4).fill(null);

  return (
    <div className="flex flex-col h-full">
      {/* Top navbar skeleton */}
      <div className="h-20 px-8 flex items-center gap-4 border-b border-base-300 bg-base-100/80 rounded-tr-2xl relative z-10">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>

      {/* Chat area with flickering background */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
        {/* FlickeringGrid as background */}
        <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
          <FlickeringGrid width={1000} maxOpacity={0.09} />
        </div>

        {/* Skeleton Messages (foreground) */}
        <div className="relative z-10">
          {skeletonMessages.map((_, idx) => (
            <div
              key={idx}
              className={`flex ${
                idx % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div className="max-w-[70%]">
                <div className="skeleton h-12 w-40 rounded-xl mb-2" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
