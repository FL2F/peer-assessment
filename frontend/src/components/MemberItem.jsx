import { useNavigate } from "react-router-dom";

const MemberItem = ({ member }) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/johari-test/${member.id}`);
  };
  return (
    <div>
      <div className="calendar-body" onClick={onClick}>
        <div className="calendar-snippet">
          <h2>Traits For {member.title ? member.title : member.username}</h2>
        </div>
      </div>
    </div>
  );
};
export default MemberItem;
