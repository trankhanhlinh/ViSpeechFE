import STORAGE from 'utils/storage'
import { JWT_TOKEN, DEFAULT_ERR_MESSAGE } from 'utils/constant'
import { apiUrl } from './api-url'

export default class ProjectService {
  static createProject = ({ name, description, userId }) => {
    const api = `${apiUrl}/projects`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    return fetch(api, {
      method: 'POST',
      body: JSON.stringify({ name, description, userId }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.text()
      })
      .then(result => {
        const resultObj = result ? JSON.parse(result) : {}
        if (status !== 201) {
          throw new Error(resultObj.message || DEFAULT_ERR_MESSAGE)
        }
        return resultObj
      })
      .catch(err => {
        throw new Error(err.message || DEFAULT_ERR_MESSAGE)
      })
  }

  static getMyProjectList = filterConditions => {
    const { userId, pageIndex, pageSize } = filterConditions
    const offset = pageIndex * pageSize
    const limit = pageSize

    const api =
      pageIndex != null && pageSize != null
        ? `${apiUrl}/projects/user-projects?userId=${encodeURIComponent(
            userId
          )}&offset=${offset}&limit=${limit}`
        : `${apiUrl}/projects/user-projects?userId=${encodeURIComponent(userId)}`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    // eslint-disable-next-line no-undef
    return fetch(api, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.json()
      })
      .then(result => {
        if (status !== 200) {
          throw new Error(result.message || DEFAULT_ERR_MESSAGE)
        }
        return result
      })
      .catch(err => {
        throw new Error(err.message || DEFAULT_ERR_MESSAGE)
      })
  }

  static getAcceptedProjectList = filterConditions => {
    const { userId, pageIndex, pageSize } = filterConditions
    const offset = pageIndex * pageSize
    const limit = pageSize

    const api = `${apiUrl}/projects/accepted-projects?userId=${encodeURIComponent(
      userId
    )}&offset=${offset}&limit=${limit}`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    // eslint-disable-next-line no-undef
    return fetch(api, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.json()
      })
      .then(result => {
        if (status !== 200) {
          throw new Error(result.message || DEFAULT_ERR_MESSAGE)
        }
        return result
      })
      .catch(err => {
        throw new Error(err.message || DEFAULT_ERR_MESSAGE)
      })
  }

  static getProjectInfo = id => {
    const api = `${apiUrl}/projects/${id}`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    return fetch(api, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.json()
      })
      .then(result => {
        if (status !== 200) {
          throw new Error(result.message || DEFAULT_ERR_MESSAGE)
        }
        return result
      })
      .catch(err => {
        throw new Error(err.message || DEFAULT_ERR_MESSAGE)
      })
  }

  static updateProjectInfo = (id, info) => {
    const api = `${apiUrl}/projects/${id}`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    return fetch(api, {
      method: 'PUT',
      body: JSON.stringify({
        ...info,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.text()
      })
      .then(result => {
        const resultObj = result ? JSON.parse(result) : {}
        if (status !== 200) {
          throw new Error(resultObj.message || DEFAULT_ERR_MESSAGE)
        }
        return resultObj
      })
      .catch(err => {
        throw new Error(err.message || DEFAULT_ERR_MESSAGE)
      })
  }
}
