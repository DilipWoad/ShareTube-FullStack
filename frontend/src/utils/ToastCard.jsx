import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToastCardHidden } from "../slices/toastCardSlice";

const ToastCard = () => {
  const toastCardDetail = useSelector((store) => store.toast);
  const [hidden, setHidden] = useState(false);
  const [animation, setAnimation] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("ehhhhhhhhhhhhhhhhhhhhhh")
    if (toastCardDetail.showCard) {
      setHidden(false);
      setAnimation(false);

      const hideTimer = setTimeout(() => {
        setAnimation(true); // Start slide-out animation
        setTimeout(() => {
          setHidden(true);
          dispatch(setToastCardHidden());
        }, 2000); // Allow animation to complete
      }, 4000); // Toast visible duration

      return () => clearTimeout(hideTimer);
    }
  }, []);
  if (hidden) return null;
  return (
    (
      <div
        className={`fixed sm:bottom-4 sm:left-4 top-20 right-0 p-2 sm:min-w-48 transition-all duration-1000 ${
          animation ? "sm:-translate-x-20 translate-x-20 opacity-0  " : ""
        }`}
      >
        <p
          className={`${
            toastCardDetail.cardColor ? toastCardDetail.cardColor : "bg-white"
          } ${
            toastCardDetail.textColor
          } px-2 py-3 rounded-md opacity-85 truncate`}
        >
          {toastCardDetail.label
            ? toastCardDetail.label
            : "Video added to Playlist"}
        </p>
      </div>
    )
  );
};
export default ToastCard;
