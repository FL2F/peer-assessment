import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import GroupItem from "../components/GroupItem";
import { getAllGroups } from "../features/groups/groupSlice";
import { testsReset } from "../features/tests/testSlice";
import { resetTraits } from "../features/traits/traitSlice";

const GroupSelect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );
  const { groupsArr } = useSelector((state) => state.groups);

  useEffect(() => {
    if (isError) toast.error(message);
    if (!user || !user.id) {
      return navigate("/login");
    }
    if (user.role !== "admin") return navigate("/");
    dispatch(resetTraits());
    dispatch(testsReset());
    dispatch(getAllGroups());
  }, [user, navigate, dispatch, isError, message]);

  if (isLoading) return <Spinner />;

  return (
    <>
      {user ? (
        <>
          <section className="heading">
            <h2>Admin Peer Assessment Panel</h2>
            <p>Please select a group</p>
          </section>
          <section className="content">
            {groupsArr.length > 0 ? (
              <div className="members">
                {groupsArr.map((group, index) => (
                  <GroupItem key={index} group={group} />
                ))}
              </div>
            ) : (
              <h3>No groups to show</h3>
            )}
          </section>
        </>
      ) : (
        <>
          <h2>You're not logged in</h2>
          <Link to="/login">
            <button className="btn btn-primary btn-block" type="submit">
              Please Login
            </button>
          </Link>
        </>
      )}
    </>
  );
};
export default GroupSelect;
