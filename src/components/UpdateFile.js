import React, { useEffect, useState } from 'react';
import './UpdateFile.css';
import number from '../images/ochoBlanco.png';
import * as tf from '@tensorflow/tfjs';
import { Bar } from 'react-chartjs-2';

const initState = {
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [
        {
            label: '% predict',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
}

const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
};

const UpdateFile = () => {

    const [imagen, setImagen] = useState("")
    const [prediccion, setPrediccion] = useState("")
    const [data, setData] = useState(initState)

    useEffect(() => {
        setImagen(number)
    }, [])

    const handleInputImageChange = ({ target }) => {
        setData({ initState });
        setImagen(URL.createObjectURL(target.files[0]));
        setPrediccion("");
    }

    const loadModelCNN = async () => {
        console.log("Init")
        const model = await tf.loadLayersModel("./models/model.json");
        console.log('Successfully loaded model');
        let img = tf.browser.fromPixels(document.getElementById("imagen"), 1).toFloat();
        img = tf.image.resizeBilinear(img, [28, 28]);
        img = tf.reshape(img, [-1, 28, 28, 1]);
        img = tf.div(img, 255)
        if (document.getElementById("inlineRadio2").checked) {
            const oneImg = tf.onesLike(img);
            img = tf.sub(oneImg, img);
        }
        const prediction = model.predict(img).dataSync();
        const ValorMasAlto = Math.max(...prediction);
        const numero = prediction.indexOf(ValorMasAlto);
        setPrediccion(numero);
        setData({
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            datasets: [
                {
                    label: '% predict',
                    data: Object.values(prediction).map(x => x * 100),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        })
    }

    return (
        <div>
            <div className="same-line mt-3">
                <div className="row">
                    <div className="col">
                        <img id="imagen" src={imagen} alt="numero" className="imagen mt-2" />
                    </div>
                    <div className="chart-bar col">
                        <div className="chart-bar">
                            <Bar data={data} options={options} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" defaultChecked />
                <label className="form-check-label" htmlFor="inlineRadio1">Digito en blanco</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                <label className="form-check-label" htmlFor="inlineRadio2">Digito en negro</label>
            </div>
            <div className="mt-3">
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="validatedCustomFile" onChange={handleInputImageChange} />
                    <div className="invalid-feedback">Example invalid custom file feedback</div>
                </div>
            </div>
            <button onClick={loadModelCNN} type="button" className="mt-3 btn btn-primary">
                Predecir
            </button>
            <h2
                className="mt-3"
            >
                {prediccion}
            </h2>
        </div>
    )
}

export default UpdateFile
