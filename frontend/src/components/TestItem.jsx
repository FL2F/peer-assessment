import { useNavigate } from "react-router-dom";

const TestItem = ({ test }) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/johari-test/${test.test_id}/edit`);
  };
  return (
    <div>
      <div className="calendar-body test-item" onClick={onClick}>
        <div className="calendar-snippet">
          <h2>Traits For {test.title ? test.title : test.username}</h2>
        </div>
      </div>
    </div>
  );
};
export default TestItem;
