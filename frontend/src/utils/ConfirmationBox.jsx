import axios from "axios";
import { BASE_URL } from "./constant";
import { useDispatch } from "react-redux";
import { togglePublished } from "../slices/studioSlice";
import { toastCardDetail } from "../slices/toastCardSlice";

const ConfirmationBox = ({
  toggle,
  setToggle,
  id,
  setShowBox,
  subscriptionClick,
  setSubscriberCount,
  userId,
}) => {
  const dispatch = useDispatch();

  const updateSubscriptionToggle = (toggleSubs) => {
    setToggle(toggleSubs);
    setSubscriberCount((prevSubCount) => prevSubCount + (toggleSubs ? 1 : -1));
  };
  //if ny error hppens
  const rollbackSubscriptionToggle = (toggleSubs) => {
    setToggle((prev) => !prev);
    setSubscriberCount((prevSubCount) => prevSubCount + (toggleSubs ? -1 : 1));
  };
  const handleYesClick = async () => {
    const isOwnChannel = id === userId;
    if (subscriptionClick) {
      if (isOwnChannel) {
        alert("You can't Subscribe to your channel!!");
        setShowBox(false);
        return;
      }
      const toggleSubs = !toggle;
      updateSubscriptionToggle(toggleSubs);
      setShowBox(false);
      try {
        const res = await axios.post(
          `${BASE_URL}/subscription/c/${id}`,
          {},
          { withCredentials: true }
        );
        console.log(res.data.message);
        //toggle the subscribed state
        dispatch(toastCardDetail({
          label: toggleSubs ?"Subscribed to the Channel" :"Unsubscribed to the Channel",
          cardColor: "bg-green-500",
        }))
      } catch (error) {
        console.error(error);
        //if error rollbck to prevs states
        rollbackSubscriptionToggle(toggleSubs);
        setShowBox(true); //if error hppen click one more time
        return; //if finish don't check below
      }
    } else {
      dispatch(togglePublished(id));
      setToggle(!toggle);
      try {
        const res = await axios.patch(
          `${BASE_URL}/video/togglePublished/${id}`,
          {},
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log(res.data);
      } catch (error) {
        console.error(error);
        dispatch(togglePublished(id));
        setToggle((prev) => !prev);
        setShowBox(true);
        return;
      }
    }
    setShowBox(false); //at the end remove the box
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-slate-400  w-72 flex flex-col p-3 shadow-lg rounded-lg">
        <div className="text-center py-4 text-lg">
          {!toggle ? (
            <p>
              {subscriptionClick
                ? "Do You Want to Subscribe to the Channel?"
                : "Do You Want to Published a Video?"}
            </p>
          ) : (
            <p>
              {subscriptionClick
                ? "Do You Want to UnSubscribe the Channel?"
                : "Do You Want to Unpublished a Video?"}
            </p>
          )}
        </div>
        <div className="flex justify-around mt-4">
          <button
            onClick={() => setShowBox(false)}
            className="bg-gray-500 text-sm font-medium text-white py-2 px-5 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleYesClick}
            className="bg-white py-2 px-5 rounded-lg text-sm font-bold hover:bg-gray-200"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBox;
