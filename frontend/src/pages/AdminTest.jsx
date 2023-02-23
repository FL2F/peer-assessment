import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getMembers } from "../features/members/memberSlice";
import {
  createTraits,
  createTraitsForOthers,
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

  const { membersArr } = useSelector((state) => state.members);

  useEffect(() => {
    if (isError)
      toast.error(message, {
        position: toast.POSITION.TOP_LEFT,
      });
    if (!user) {
      return navigate("/login");
    }
    if (user.role !== "admin") navigate("/");
  }, [user, isError, message, navigate, dispatch, membersArr]);

  const subject_id = id;
  const inputer_id = String(user.id);
  const group_id = user.group_id;
  const username = user.username;

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
    if (canSave) {
      try {
        dispatch(
          createTest({
            test_id,
            subject_id,
            inputer_id,
            username,
            group_id,
          })
        );
        selectedTraits.forEach((adjective) => {
          const trait_id = uuidv4();
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
        });
        toast.success("Peer Assessment Complete");
        setTestID(uuidv4());
        setSelectedTraits([]);
        dispatch(getAllTraitsFromGroup());
        dispatch(getSelfTraits());
        if (user.role !== "admin") {
          dispatch(getAllMembersForGroup());
          navigate("/");
        } else {
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
      toast.error("You must select at least 1 trait", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  // Used to select and deselect traits
  const selectedClick = (trait) => {
    if (!selectedTraits.includes(trait)) {
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
