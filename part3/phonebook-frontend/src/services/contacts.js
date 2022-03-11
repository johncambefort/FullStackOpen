import axios from "axios";
const baseUrl = "https://polar-inlet-70913.herokuapp.com/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newPersonObj) => {
  const request = axios.post(baseUrl, newPersonObj);
  return request.then((response) => response.data);
};

const update = (id, newObj) => {
  const request = axios.put(`${baseUrl}/${id}`, newObj);
  return request.then((response) => response.data);
};

const remove = (id, personObj) => {
  const request = axios.delete(`${baseUrl}/${id}`, personObj);
  return request
          .then((response) => response.data);
};

export default { getAll, create, update, remove };
