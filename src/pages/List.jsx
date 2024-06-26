import ChatList from "../components/ChatList";
import UserInfo from "../components/UserInfo";

function List() {
  return (
    <div className="flex-1 overflow-scroll">
      <UserInfo />
      <ChatList />
    </div>
  );
}

export default List;
