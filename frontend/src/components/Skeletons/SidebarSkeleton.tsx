import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(3).fill(null);

  return (
    <aside className="h-full w-full flex flex-col">
      {/* Search bar skeleton */}
      <div className="px-4 pt-4 pb-2">
        <div className="skeleton h-10 w-full rounded-lg" />
      </div>
      {/* Skeleton Contacts */}
      <div className="flex-1 overflow-y-auto w-full py-1">
        {skeletonContacts.map((_, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-3 px-4 py-3">
              {/* Avatar skeleton */}
              <div className="skeleton w-10 h-10 rounded-full" />
              {/* User info skeleton */}
              <div className="flex-1 min-w-0">
                <div className="skeleton h-4 w-24 mb-2 rounded" />
                <div className="skeleton h-3 w-32 rounded" />
              </div>
            </div>
            {idx !== skeletonContacts.length - 1 && (
              <div className="border-b border-base-300 mx-4" />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
