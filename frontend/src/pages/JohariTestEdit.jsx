import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  getAllMembersForGroup,
  getMembers,
} from "../features/members/memberSlice";
import {
  getAllTraitsForTest,
  deleteTraitsForTest,
  createTraits,
  resetTraits,
  getSelfTraits,
  getAdminSelf,
  getAllTraitsFromGroup,
  getAdminTraitsFromGroup,
} from "../features/traits/traitSlice";
import Spinner from "../components/Spinner";
import traits from "../helperFunctions/traitsArr";

import "../styles/peer-assessment.scss";
import { getAllTests } from "../features/tests/testSlice";

const JohariTestEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // states
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);

  const { id } = useParams();
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );
  const { testsArr } = useSelector((state) => state.tests);
  const { currentTestTraits } = useSelector((state) => state.traits);
  const { membersArr } = useSelector((state) => state.members);

  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
    if (isError) {
      toast.error(message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
    if (membersArr.length === 0 && user.role !== "admin") {
      dispatch(getAllMembersForGroup());
    }
    if (membersArr.length === 0 && user.role === "admin") {
      // having trouble with getting the group_id, so i will navigate back to the group-select instead
      // dispatch(getMembers(id));
      return navigate("/group-select");
    }
    if (testsArr.length === 0) {
      dispatch(getAllTests());
    }
    if (user.role === "admin") {
      setGroupId(membersArr[0].group_id);
    } else {
      setGroupId(user.group_id);
    }

    const test = testsArr.filter((test) => test.test_id === id);
    setCurrentTest(test[0]);
  }, [id, user, isError, message, navigate, dispatch, testsArr]);

  useEffect(() => {
    if (currentTestTraits.length === 0 && currentTest) {
      dispatch(getAllTraitsForTest(currentTest.test_id));
    }
    if (currentTestTraits.length >= 1 && currentTest) {
      const adjectives = currentTestTraits.map((trait) => ({
        adjective: trait.adjectives,
        trait_id: trait.trait_id,
      }));
      setSelectedTraits(adjectives);
    }
  }, [currentTestTraits, currentTest, dispatch]);

  const inputer_id = currentTest ? currentTest.inputer_id : "";
  const subject_id = currentTest ? currentTest.subject_id : "";
  const username = currentTest ? currentTest.username : "";
  const group_id = groupId;

  // Used to select and deselect traits
  const selectedClick = (trait) => {
    if (
      !selectedTraits.some((selected) => selected.adjective === trait) &&
      selectedTraits.length <= 4
    ) {
      return setSelectedTraits([
        ...selectedTraits,
        { adjective: trait, trait_id: uuidv4() },
      ]);
    }
    setSelectedTraits(
      selectedTraits.filter(
        (selectedTrait) => selectedTrait.adjective !== trait
      )
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const canSave = [
      id,
      String(inputer_id),
      String(subject_id),
      group_id,
      username,
      selectedTraits,
    ].every((el) => el.length >= 1);
    if (canSave) {
      try {
        dispatch(
          deleteTraitsForTest({
            test_id: id,
          })
        );
        selectedTraits.forEach((adjective) => {
          const newTraitID = uuidv4();

          dispatch(
            createTraits({
              trait_id: adjective.trait_id ? adjective.trait_id : newTraitID,
              subject_id,
              inputer_id,
              adjective: adjective.adjective,
              test_id: id,
              group_id,
            })
          );
        });
        toast.success("Peer Assessment Complete");
        setSelectedTraits([]);
        dispatch(resetTraits());
        if (user.role !== "admin") {
          dispatch(getAllTraitsFromGroup());
          dispatch(getSelfTraits());
          dispatch(getAllMembersForGroup());
          navigate("/");
        } else {
          dispatch(getAdminSelf(group_id));
          dispatch(getAdminTraitsFromGroup(group_id));
          dispatch(getMembers(group_id));
          navigate(`/${group_id}`);
        }
      } catch (error) {
        const message =
          error.response.data.message || error.message || error.toString();
        toast.error(message);
        console.log(message);
      }
    } else {
      console.log("cansave", canSave);
      console.log("id", id);
      console.log("subject_id", subject_id);
      console.log("inputer_id :>> ", inputer_id);
      console.log("group_id", group_id);
      console.log("username :>> ", username);
      console.log("selectedTraits", selectedTraits);
      if (selectedTraits.length === 0) {
        toast.error("You must select at least 1 trait", {
          position: toast.POSITION.TOP_LEFT,
        });
      } else {
        toast.error("Failed to Submit");
      }
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <section className="schedule-form">
      <div className="heading">
        {/* <h2>Peer Assessment For {currentTest.username}</h2> */}
      </div>

      <div className="trait-container">
        {traits.sort().map((trait, index) => (
          <button
            key={index}
            onClick={() => selectedClick(trait)}
            className={
              selectedTraits.some((selected) => selected.adjective === trait)
                ? "btn btn-secondary btn-add selected"
                : "btn btn-secondary btn-add"
            }
          >
            {trait}
          </button>
        ))}
      </div>

      <div className="btn-group">
        <button className="btn btn-primary" type="submit" onClick={onSubmit}>
          Submit Assessment
        </button>
        <button
          onClick={() => {
            if (user.role !== "admin") {
              navigate("/");
            } else {
              navigate(`/${group_id}`);
            }
          }}
          className="btn btn-cancel"
        >
          Cancel
        </button>
      </div>
    </section>
  );
};
export default JohariTestEdit;
