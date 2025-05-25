'use client'
import { useDispatch, useSelector } from "react-redux";
import { addExperience } from "../../../features/filter/filterSlice";

const ExperienceLevel = ({ experienceLevels }) => {
    const dispatch = useDispatch();

    // Lấy experience đang được chọn từ filter slice
    const { jobList } = useSelector((state) => state.filter) || {};
    const selectedExperienceLevels = jobList?.experience || [];

    // experience handler
    const experienceHandler = (e, value) => {
        dispatch(addExperience(value));
    };

    return (
        <ul className="switchbox">
            {experienceLevels?.map((item) => (
                <li key={item.id}>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={selectedExperienceLevels.includes(item.name.toLocaleLowerCase().split(" ").join("-"))}
                            value={item.name}
                            onChange={(e) => experienceHandler(e, item.name.toLocaleLowerCase().split(" ").join("-"))}
                        />
                        <span className="slider round"></span>
                        <span className="title">{item.name}</span>
                    </label>
                </li>
            ))}
            <li>
                <button className="view-more">
                    <span className="icon flaticon-plus"></span> View More
                </button>
            </li>
        </ul>
    );
};

export default ExperienceLevel;
