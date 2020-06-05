import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'

import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios'
import api from '../../services/api'

import './style.css';

import logo from '../../assets/logo.svg'
import check from '../../assets/check.svg'
import Dropzone from '../../components/Dropzone';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
  nome: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUFs] = useState<IBGEUFResponse[]>([]);
  const [cities, setCities] = useState<IBGECityResponse[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [message, setMessage] = useState(false)

  const [selectedUf, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [selectedItens, setSelectedItens] = useState<number[]>([])
  const [selectedFile, setSelectedFile] = useState<File>()

  const history = useHistory()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude])
      setSelectedPosition([latitude, longitude])
    })
  }, [])
  useEffect(() => {
    api.get('items')
      .then(res => setItems(res.data))
      .catch(err => console.log(err))

  }, [])

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => setUFs(res.data))
      .catch(err => console.log(err))

  }, [])

  useEffect(() => {
    if (selectedUf === '0') return;

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
      .then(res => setCities(res.data))
      .catch(err => console.log(err))

  }, [selectedUf])

  const handleSelectedUF = (event: ChangeEvent<HTMLSelectElement>) => {
    const uf = event.target.value;
    setSelectedUF(uf);
  }

  const handleSelectedCity = (event: ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setSelectedCity(city);
  }

  const handleMapClick = (event: LeafletMouseEvent) => {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value })
  }

  const handleSelectItem = (id: number) => {
    const alreadySelected = selectedItens.findIndex(item => item === id)

    if (alreadySelected >= 0) {
      const filteredItems = selectedItens.filter(item => item !== id)

      setSelectedItens(filteredItems)
    } else
      setSelectedItens([...selectedItens, id])
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItens;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    if (selectedFile) data.append('image', selectedFile);

    await api.post('points', data)
      .then(res => {
        setMessage(true);
      })
      .catch(err => console.log(err))
  }

  const handleCheckClick = () => {
    history.push('/');
  }

  return (
    <>
      {message ?
        <div id="loader" onClick={handleCheckClick}>
          <div className="loader-section">
            <img src={check} alt="icon" className="loading-icon"></img>
            <h2>Cadastro concluído !</h2>
          </div>
        </div> : null}

      <div id="page-create-point">
        <header>
          <img src={logo} alt="EColeta" />
          <Link to="/" >
            <FiArrowLeft />
          Voltar para home
        </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>Cadastro do <br /> ponto de coleta</h1>

          <Dropzone onFileUploaded={setSelectedFile} />

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange} />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange} />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={initialPosition} zoom={15}
              onclick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={selectedPosition} />
            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select
                  name="uf"
                  id="uf"
                  value={selectedUf}
                  onChange={handleSelectedUF}>
                  <option value="0">Selecione uma UF</option>
                  {
                    ufs.map((uf, i) => (
                      <option key={i} value={uf.sigla}>{uf.nome}</option>
                    ))
                  }

                </select>
              </div>

              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select
                  name="city"
                  id="city"
                  value={selectedCity}
                  onChange={handleSelectedCity}>
                  <option value="0">Selecione uma cidade</option>
                  {
                    cities.map((city, i) => (
                      <option key={i} value={city.nome}>{city.nome}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Itens de coleta</h2>
              <span>Selecione um ou mais itens no mapa</span>
            </legend>

            <ul className="items-grid">
              {
                items.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelectItem(item.id)}
                    className={selectedItens.includes(item.id) ?
                      'selected' : ''}>
                    <img src={item.image_url} alt={item.title} />
                    <span>{item.title}</span>
                  </li>
                ))
              }
            </ul>
          </fieldset>

          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </div>
    </>
  )
}

export default CreatePoint
