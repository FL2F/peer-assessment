import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getAll,
  getAllMembersForGroup,
  getMembers,
} from "../features/members/memberSlice";
import {
  getAllTraitsFromGroup,
  createTraits,
  createTraitsForOthers,
  getSelfTraits,
  getAdminSelf,
  getAdminTraitsFromGroup,
} from "../features/traits/traitSlice";
import Spinner from "../components/Spinner";
import traits from "../helperFunctions/traitsArr";

import "../styles/peer-assessment.scss";
import { createTest } from "../features/tests/testSlice";

const JohariTest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // states
  const [test_id, setTestID] = useState(uuidv4());
  const [selectedTraits, setSelectedTraits] = useState([]);

  const { id } = useParams();

  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );
  const [currentMember, setCurrentMember] = useState("");
  const [groupId, setGroupId] = useState("");

  const { membersArr, allMembers } = useSelector((state) => state.members);

  useEffect(() => {
    if (isError)
      toast.error(message, {
        position: toast.POSITION.TOP_LEFT,
      });
    if (!user) {
      return navigate("/login");
    }

    if (membersArr.length === 0 && user.role !== "admin") {
      dispatch(getAllMembersForGroup());
    }

    if (membersArr.length === 0 && user.role === "admin") {
      // having trouble with getting the group_id, so i will navigate back to the group-select instead
      // dispatch(getMembers(id));
      return navigate("/group-select");
    }

    if (allMembers.length === 0) {
      dispatch(getAll());
    }

    allMembers.find((member) => {
      if (String(member.id) === id) {
        setCurrentMember(member);
      }
      return currentMember;
    });

    if (
      (user.role === "admin" || user.role === "facilitator") &&
      id === String(user.id)
    ) {
      setCurrentMember(user);
    }
    if (user.role === "admin" || user.role === "facilitator") {
      setGroupId(membersArr[0].group_id);
    } else {
      setGroupId(user.group_id);
    }
  }, [user, isError, message, navigate, dispatch, membersArr, allMembers]);

  const subject_id = id;
  const inputer_id = String(user.id);
  const group_id = groupId;
  const username = currentMember.username;
  const title = currentMember.title;

  // Submit schedule and events
  const onSubmit = (e) => {
    e.preventDefault();

    const canSave = [
      test_id,
      subject_id,
      inputer_id,
      group_id,
      username,
      selectedTraits,
    ].every((el) => el.length >= 1);
    if (selectedTraits.length < 4)
      return toast.error("4-5 traits must be selected");
    if (selectedTraits.length > 5)
      return toast.error("Maximum 5 traits must be selected");
    if (canSave) {
      // console.log("test_id", test_id);
      // console.log("subject_id", subject_id);
      // console.log("inputer_id", inputer_id);
      // console.log("group_id", group_id);
      // console.log("usernsme", username);
      // console.log("selectedTraits", selectedTraits);
      try {
        new Promise((resolve, reject) => {
          dispatch(
            createTest({
              test_id,
              subject_id,
              inputer_id,
              username,
              group_id,
              title,
            })
          )
            .then(() => {
              selectedTraits.forEach((adjective) => {
                const trait_id = uuidv4();
                if (subject_id === inputer_id) {
                  dispatch(
                    createTraits({
                      trait_id,
                      subject_id,
                      inputer_id,
                      adjective,
                      test_id,
                      group_id,
                    })
                  );
                } else {
                  dispatch(
                    createTraitsForOthers({
                      trait_id,
                      subject_id,
                      inputer_id,
                      adjective,
                      test_id,
                      group_id,
                    })
                  );
                }
              });
              toast.success("Peer Assessment Complete");
              setTestID(uuidv4());
              setSelectedTraits([]);
              dispatch(getAllTraitsFromGroup());
              if (user.role !== "admin") {
                dispatch(getSelfTraits());
                dispatch(getAllMembersForGroup());
                navigate("/");
              } else {
                dispatch(getAdminSelf(group_id));
                dispatch(getAdminTraitsFromGroup(group_id));
                dispatch(getMembers(group_id));
                navigate(`/${group_id}`);
              }
              resolve();
            })
            .catch((error) => {
              const message =
                error.response.data.message ||
                error.message ||
                error.toString();
              toast.error(message);
              console.log(message);
              reject(error);
            });
        });
      } catch (error) {
        const message =
          error.response.data.message || error.message || error.toString();
        toast.error(message);
        console.log(message);
      }
    } else {
      toast.error("You must select at least 1 trait", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  // Used to select and deselect traits
  const selectedClick = (trait) => {
    if (!selectedTraits.includes(trait) && selectedTraits.length <= 4) {
      return setSelectedTraits([...selectedTraits, trait]);
    }
    setSelectedTraits(
      selectedTraits.filter((selectedTrait) => selectedTrait !== trait)
    );
  };

  if (isLoading) return <Spinner />;

  return (
    <section className="schedule-form">
      <div className="heading">
        <h2>
          Peer Assessment For {currentMember.title || currentMember.username}
        </h2>

        <p>Please input 5 traits</p>
      </div>

      <div className="trait-container">
        {traits.sort().map((trait, index) => (
          <button
            key={index}
            onClick={() => selectedClick(trait)}
            className={
              selectedTraits.includes(trait)
                ? "btn btn-secondary btn-add selected"
                : "btn btn-secondary btn-add"
            }
          >
            {trait}
          </button>
        ))}
      </div>

      <div className="btn-group">
        <button
          className="btn btn-primary btn-submit"
          type="submit"
          onClick={onSubmit}
        >
          Submit Assessment
        </button>
        <button
          onClick={() => {
            if (user.role !== "admin") {
              navigate("/");
            } else {
              navigate(`/group-select`);
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
export default JohariTest;
