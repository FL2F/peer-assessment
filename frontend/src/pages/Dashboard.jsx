import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAll, getAllMembersForGroup } from "../features/members/memberSlice";
import {
  getAllTraitsFromGroup,
  getSelfTraits,
  resetTraits,
} from "../features/traits/traitSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import MemberItem from "../components/MemberItem";
import TestItem from "../components/TestItem";
import { getAllTests } from "../features/tests/testSlice";
import { logout } from "../features/auth/authSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );
  const { membersArr, allMembers } = useSelector((state) => state.members);
  const { testsArr } = useSelector((state) => state.tests);

  useEffect(() => {
    if (isError) toast.error(message);
    if (!user || !user.id || user.message) {
      logout();
      return navigate("/login");
    }

    if (user.role === "admin") {
      return navigate("/group-select");
    }

    if (allMembers.length === 0) {
      dispatch(getAll());
    }

    dispatch(getAllTests());
    dispatch(getAllMembersForGroup());
    dispatch(getAllTraitsFromGroup());
    dispatch(getSelfTraits());
    // dispatch(resetTraits());
  }, [user, allMembers, navigate, dispatch, isError, message]);

  const facilitator = allMembers.find(
    (member) => member.id === membersArr[0].facilitator
  );

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

  // Check if facilitator has completed test
  let facilitatorCompleted = false;
  for (let i = 0; i < testsArr.length; i++) {
    if (facilitator.username === testsArr[i].username) {
      facilitatorCompleted = true;
      break;
    }
  }

  if (!facilitatorCompleted) {
    incompleteTests.unshift(facilitator);
  }

  if (isLoading) return <Spinner />;

  return (
    <>
      {user ? (
        <>
          <section className="heading dashboard-heading">
            <h2>Welcome to the Peer Assessment Panel</h2>

            {/* {facilitator && (
              <button
                className="btn btn-secondary btn-add"
                type="submit"
                onClick={() => {
                  navigate(`/johari-test/${facilitator.id}`);
                }}
              >
                Input Traits For {facilitator.title}
              </button>
            )} */}
          </section>
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
export default Dashboard;
