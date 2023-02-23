import { useNavigate } from "react-router-dom";

const GroupItem = ({ group }) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/${group}`);
  };
  return (
    <div>
      <div className="calendar-body test-item" onClick={onClick}>
        <div className="calendar-snippet">
          <h2>Group: {group}</h2>
        </div>
      </div>
    </div>
  );
};
export default GroupItem;
