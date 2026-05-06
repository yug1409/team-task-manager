import { useEffect } from "react";

const useLockBodyScroll = (isLocked) => {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);
};

export default useLockBodyScroll;