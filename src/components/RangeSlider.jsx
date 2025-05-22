import { Range, getTrackBackground } from 'react-range';
import './RangeSlider.css';

const RangeSlider = ({ step, min, max, values, onChange, onSave }) => {
    return (
        <div className="w-full py-4">
            <Range
                values={values}
                step={step}
                min={min}
                max={max}
                onChange={onChange}
                onSave={onSave}
                renderTrack={({ props, children }) => {
                    const { key, ...rest } = props;
                    return (
                        <div
                            {...rest}
                            key={key}
                            style={{
                                ...props.style,
                                height: "6px",
                                width: "100%",
                                background: getTrackBackground({
                                    values: values,
                                    colors: ['#ccc', '#ff5864', '#ccc'],
                                    min: min,
                                    max: max
                                }),
                                borderRadius: "4px"
                            }}
                        >
                            {children}
                        </div>
                    );
                }}
                renderThumb={({ props, index, isDragged }) => {
                    const { key, ...rest } = props;
                    return (
                        <div
                            {...rest}
                            key={key}
                            style={{
                                ...props.style,
                                height: "20px",
                                width: "20px",
                                borderRadius: "50%",
                                backgroundColor: "#fff",
                                border: "2px solid #ff5864",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: isDragged ? 'grabbing' : 'grab'
                            }}
                        >
                        </div>
                    )
                }}
            />
        </div>
    );
};

export default RangeSlider;