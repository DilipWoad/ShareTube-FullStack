import MenuOptionCard from "./MenuOptionCard";

const SideBar = ({ menuClicked }) => {
  return (
    <div className={`bg-sky-300 h-fit ${menuClicked ? "w-64" : ""}`}>
      <ul
        className={`bg-red-300 flex flex-col items-center ${
          menuClicked ? "my-2 gap-y-2" : "gap-y-8 mt-5"
        }  text-[12px] font-semibold min-w-22 mx-1`}
      >
        <MenuOptionCard
          Icon={"🏠︎"}
          Label={"Home"}
          menuClicked={menuClicked}
          path={"/"}
        />
        <MenuOptionCard
          Icon={"🎫"}
          Label={"Subscription"}
          menuClicked={menuClicked}
          path={"/subscription"}
        />
        <MenuOptionCard
          Icon={"🙍🏻‍♂️"}
          Label={"You"}
          menuClicked={menuClicked}
          path={"/you"}
        />
      </ul>
    </div>
  );
};

export default SideBar;
