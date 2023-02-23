import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAll, getMembers } from "../features/members/memberSlice";
import { getAdminSelf, resetTraits } from "../features/traits/traitSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import MemberItem from "../components/MemberItem";
import TestItem from "../components/TestItem";
import { getAdminTestsForGroup } from "../features/tests/testSlice";
import { logout } from "../features/auth/authSlice";

const DashboardForGroup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );
  const { allMembers, membersArr } = useSelector((state) => state.members);
  const { testsArr } = useSelector((state) => state.tests);

  // selected group_id
  const { id } = useParams();

  useEffect(() => {
    if (isError) toast.error(message);
    if (!user || !user.id) {
      logout();
      return navigate("/login");
    }

    if (user.role !== "admin") {
      return navigate("/");
    }

    if (allMembers.length === 0) {
      dispatch(getAll());
    }

    dispatch(resetTraits());
    dispatch(getMembers(id));
    dispatch(getAdminTestsForGroup(id));
    dispatch(getAdminSelf(id));
  }, [user, navigate, dispatch, isError, message]);

  const incompleteTests = [];

  //loop through all the members in the group to see if test has been completed for that member
  for (let i = 0; i < membersArr.length; i++) {
    let memberCompleted = false;
    for (let j = 0; j < testsArr.length; j++) {
      if (membersArr[i].username === testsArr[j].username) {
        memberCompleted = true;
        break;
      }
    }
    if (!memberCompleted) {
      incompleteTests.push(membersArr[i]);
    }
  }

  const testComplete = testsArr.some((test) => {
    return test.inputer_id === user.id && test.subject_id === user.id;
  });

  if (isLoading) return <Spinner />;

  return (
    <>
      {user ? (
        <>
          <section className="heading">
            <h2>Admin Peer Assessment for {id}</h2>
            {/* this on click is navigating to the admin user's self traits */}
            <button
              className="btn btn-secondary btn-add"
              type="submit"
              onClick={() => {
                navigate(`/johari-test/${user.id}`);
              }}
              disabled={testComplete}
            >
              Input Traits For Facilitator
            </button>
          </section>
          <div className="colors">
            <div>
              <div className="box lightBlue"></div>
              <p> = Incomplete Tests,</p>
            </div>
            <div>
              <div className="box green"></div>
              <p> = Complete Tests</p>
            </div>
          </div>
          <section className="content">
            {membersArr.length > 0 ? (
              <div className="members">
                {incompleteTests.length > 0 &&
                  incompleteTests.map((member, index) => (
                    <MemberItem key={index} member={member} />
                  ))}
                {testsArr.map((test, index) => (
                  <TestItem key={index} test={test} />
                ))}
              </div>
            ) : (
              <h3>No members to show</h3>
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
export default DashboardForGroup;
