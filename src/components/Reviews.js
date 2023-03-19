import React, { useState, useEffect,useContext } from "react";
import ReactStars from "react-stars";
import { reviewsRef, db } from "../firebase/firebase";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import { green } from "@mui/material/colors";
import {Appstate} from '../App'
import { useNavigate } from "react-router-dom";


const Reviews = ({ id, prevRating, userRated }) => {
  const navigate = useNavigate();
  const useAppstate = useContext(Appstate);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [form, setForm] = useState("");
  const [data, setData] = useState([]);
  const [newAdded, setNewAdded] = useState();

  const sendReview = async () => {
    setLoading(true);
    try {
      if(useAppstate.login){
      await addDoc(reviewsRef, {
        movieid: id,
        name: useAppstate.userName ,
        rating: rating,
        thought: form,
        timestamp: new Date().getTime(),
      });
      const ref = doc(db, "movies", id);
      await updateDoc(ref, {
        rating: prevRating + rating,
        rated: userRated + 1,
      });
      setRating(0);
      setForm("");
      setNewAdded(newAdded + 1);
      swal({
        title: "Review Sent",
        icon: "success",
        buttons: false,
        timer: 3000,
      });
    } else
        {
          navigate('/login');
          }   
 } catch (error) {
      swal({
        title: error.message,
        icon: "Error",
        buttons: false,
        timer: 3000,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      setReviewsLoading(true);
      setData([]);
      let quer = query(reviewsRef, where("movieid", "==", id));
      const querySnapshot = await getDocs(quer);

      querySnapshot.forEach((doc) => {
        setData((prev) => [...prev, doc.data()]);
      });
      setReviewsLoading(false);
    }
    getData();
  }, [newAdded]);

  return (
    <div className="mt-4 py-2 border-t-2 border-gray-700 w-full">
      <ReactStars
        size={30}
        half={true}
        value={rating}
        onChange={(rate) => setRating(rate)}
      />
      <input
        value={form}
        onChange={(e) => setForm(e.target.value)}
        placeholder=" Share Your thoughts ..."
        className="w-full p-2 outline-none header"
      />
      <button
        onClick={sendReview}
        className=" flex justify-center w-full p-2 bg-green-500 hover:bg-green-700"
      >
        {loading ? <TailSpin height={20} color="white" /> : "Share"}
      </button>
      {reviewsLoading ? (
        <div className="mt-6 flex justify-center">
          <ThreeDots height={10} color="white" />
        </div>
      ) : (
        <div className="mt-7">
          {data.map((e, i) => {
            return (
              <div className=" p-2  mt-2 w-full border-b header bg-opacity-50 border-gray-600 " key={i}>
                <p>{e.thought}</p>
                <ReactStars
                  size={18}
                  half={true}
                  value={e.rating}
                  edit={false}
                />
                <div className="flex items-center">
                <p className=""><CheckCircleIcon sx={{ color: green[300],  fontSize:  17 }}  /></p>
                  <p className="text-blue-500 ml-1">{e.name}</p>
                  <p className="ml-2 text-xs">(
                    {new Date(e.timestamp).toLocaleString()}
                  )</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reviews;
