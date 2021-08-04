import "./App.css";
import ReactMapGL, {Marker, Popup} from "react-map-gl";
import {useEffect, useState} from "react";
import {Room, Star, StarBorder} from "@material-ui/icons";
import axios from "axios";
import {format} from "timeago.js";
import RegisterUser from "./components/RegisterUser";
import Login from "./components/Login"

function App() {
    const myStorage = window.localStorage
    const [currentUserName, setCurrentUserName] = useState(myStorage.getItem("user"))
    const [pins, setPins] = useState([])
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [rating, setRating] = useState(0);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 55.751999,
        longitude: 37.617734,
        zoom: 10,
    });

    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get("/pins");
                setPins(res.data);
            } catch (err) {
                console.log(err)
            }
        };
        getPins();
    }, []);

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport({...viewport, latitude: lat, longitude: long});
    };
    const handleLogout = () => {
        myStorage.removeItem("user");
        setCurrentUserName(null)
    }
    const handleAddClick = (e) => {
        const [long, lat] = e.lngLat;
        setNewPlace({
            lat: lat,
            long: long,
        })
    };
    const handleSubmit = async (e) => {
        e.preventDefault()//for not updating the page
        const newPin = {
            username: currentUserName,
            title,
            desc,
            rating,
            lat: newPlace.lat,
            long: newPlace.long
        }
        //sending to backend
        try {
            const res = await axios.post("/pins", newPin)
            setPins([...pins], res.data);
            setNewPlace(null)
        } catch (err) {
            console.log(err)
        }

    };
    return (
        <div className="App">
            <ReactMapGL  {...viewport}
                         mapboxApiAccessToken="pk.eyJ1IjoidmFsZXJpYWJ1c2h1ZXZhIiwiYSI6ImNrcnRzczZjajFrYjMydHBmeXN5YXRpOHQifQ.ggyX4i0T-pmcRJv6uQEKHg"
                         onViewportChange={nextViewport => setViewport(nextViewport)}
                         mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
                         onDblClick={handleAddClick}
                         transitionDuration="300">
                {pins.map(p => (
                    <>
                        <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom * 2.5}
                                offsetTop={-viewport.zoom * 5}>
                            <Room style={{
                                fontSize: viewport.zoom * 5,
                                color: p.username === currentUserName ? "indianred" : "purple",
                                cursor: "pointer"
                            }}
                                  onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                            />
                        </Marker>
                        {p._id === currentPlaceId && (
                            <Popup className="popup"
                                   latitude={p.lat}
                                   longitude={p.long}
                                   closeButton={true}
                                   closeOnClick={false}
                                   onClose={() => setCurrentPlaceId(null)}
                                   anchor="bottom-right">
                                <div className="card">
                                    <label>Place</label>
                                    <p className="place">{p.title}</p>
                                    <label>Review</label>
                                    <p className="descr">{p.desc}</p>
                                    <label>Rating</label>
                                    <div className='stars'>
                                        {Array(p.rating).fill(<Star className="star"/>)}
                                    </div>

                                    <label>Info</label>
                                    <span className="username">Created by <b>{p.username}</b></span>
                                    <span className="date">{format(p.createdAt)}</span>
                                </div>
                            </Popup>
                        )}
                    </>
                ))}
                {newPlace && (
                    <Popup
                        latitude={newPlace.lat}
                        longitude={newPlace.long}
                        closeButton={true}
                        closeOnClick={false}
                        onClose={() => setNewPlace(null)}
                        anchor="left">
                        <div>
                            <form onSubmit={handleSubmit} className="addNewPlace">
                                <label>Title</label>
                                <input className="title-input" placeholder="Enter a place..."
                                       onChange={(e) => setTitle(e.target.value)}/>
                                <label>Review</label>
                                <textarea className="text-descr" placeholder="Describe your experience"
                                          onChange={(e) => setDesc(e.target.value)}/>
                                <label>Rating</label>
                                <select onChange={(e) => setRating(e.target.value)}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                <button className="submitButton" type="submit">Add Pin</button>
                            </form>
                        </div>
                    </Popup>)}
                {currentUserName ? (
                    <button className="button logout" onClick={handleLogout}>
                        Log out
                    </button>
                ) : (
                    <div className="buttons">
                        <button className="button login" onClick={() => setShowLogin(true)}>
                            Log in
                        </button>
                        <button
                            className="button register"
                            onClick={() => setShowRegister(true)}>
                            Register
                        </button>
                    </div>
                )}
                {showRegister && <RegisterUser setShowRegister={setShowRegister}/>}
                {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage}
                                     setCurrentUser={setCurrentUserName}/>}
            </ReactMapGL>
        </div>
    );
}

export default App;
