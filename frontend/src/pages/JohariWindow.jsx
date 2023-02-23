import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
  getAllTraitsFromGroup,
  getSelfTraits,
} from "../features/traits/traitSlice";
import * as htmlToImage from "html-to-image";
import "../styles/johari-window.scss";

const JohariWindow = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // states
  const [selfTraits, setSelfTraits] = useState([]);
  const [traitsFromOthers, setTraitsFromOthers] = useState([]);
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  const { selfTraitsArr, userTraitsFromOthers } = useSelector(
    (state) => state.traits
  );

  useEffect(() => {
    if (isError) {
      toast.error(message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
    if (!user) {
      return navigate("/login");
    }

    if (selfTraitsArr.length === 0 && userTraitsFromOthers.length === 0) {
      toast.error("please complete the tests before checking your results");
      return navigate("/");
    }

    if (selfTraitsArr.length >= 1) {
      const selfAdjectives = selfTraitsArr.map((trait) => trait.adjectives);
      setSelfTraits(selfAdjectives);
    }

    if (userTraitsFromOthers.length >= 1) {
      const adjectivesFromOthers = userTraitsFromOthers.map(
        (trait) => trait.adjectives
      );
      setTraitsFromOthers(adjectivesFromOthers);
    }
  }, [
    isError,
    message,
    user,
    navigate,
    dispatch,
    selfTraitsArr,
    userTraitsFromOthers,
  ]);
  let open = [];
  let hidden = [];
  let blind = [];
  selfTraits.forEach((selfTrait) => {
    if (traitsFromOthers.includes(selfTrait)) {
      open.push(selfTrait);
    }
    if (!traitsFromOthers.includes(selfTrait)) {
      hidden.push(selfTrait);
    }
  });

  traitsFromOthers.forEach((trait) => {
    if (!selfTraits.includes(trait)) {
      blind.push(trait);
    }
  });

  const saveAs = (blob, fileName) => {
    let elem = window.document.createElement("a");
    elem.href = blob;
    elem.download = fileName;
    elem.style = "display:none;";
    (document.body || document.documentElement).appendChild(elem);
    if (typeof elem.click === "function") {
      elem.click();
    } else {
      elem.target = "_blank";
      elem.dispatchEvent(
        new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        })
      );
    }
    URL.revokeObjectURL(elem.href);
    elem.remove();
  };

  const takeScreenshot = (id) => {
    htmlToImage.toPng(document.getElementById(id)).then(function (dataUrl) {
      saveAs(dataUrl, `${user.username}'s-johari-window.png`);
    });
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <section className="heading johari-heading">
        <h2>Welcome to the Peer Assessment Window</h2>
      </section>
      <section className="johari" id="capture">
        <div className="johari-container">
          <h3 className="item item-top">Known to self</h3>
          <h3 className="item">Not known to self</h3>
          <h3 className="item">Known to others</h3>
          <div className=" box box-open">
            <h4>Open</h4>
            <div className="word-container">
              {open &&
                open.map((trait, index) => (
                  <div className="words" key={index}>
                    {trait}
                  </div>
                ))}
            </div>
          </div>
          <div className=" box box-blind">
            <h4>Blind</h4>
            <div className="word-container">
              {blind &&
                blind.map((trait, index) => (
                  <div className="words" key={index}>
                    {trait}
                  </div>
                ))}
            </div>
          </div>
          <h3 className="item">Not known to others</h3>
          <div className=" box box-hidden">
            <h4>Hidden</h4>
            <div className="word-container">
              {hidden &&
                hidden.map((trait, index) => (
                  <div className="words" key={index}>
                    {trait},
                  </div>
                ))}
            </div>
          </div>
          <div className=" box box-unknown">
            <h4>Unknown</h4>
          </div>
        </div>
      </section>

      <button
        className="btn btn-primary btn-add btn-submit"
        onClick={() => takeScreenshot("capture")}
      >
        Download Peer Assessment
      </button>
    </>
  );
};
export default JohariWindow;
