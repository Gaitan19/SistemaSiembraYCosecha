// API utility for handling requests with sucursal context

/**
 * Gets the current user data from localStorage
 * @returns {Object|null} User data or null if not logged in
 */
export const getCurrentUser = () => {
    try {
        const userStr = window.localStorage.getItem("sesion_usuario")
        return userStr ? JSON.parse(userStr) : null
    } catch (error) {
        console.error('Error parsing user data:', error)
        return null
    }
}

/**
 * Gets the current selected sucursal from localStorage
 * @returns {Object|null} Sucursal data or null if not selected
 */
export const getCurrentSucursal = () => {
    try {
        const sucursalStr = window.localStorage.getItem("sucursal_seleccionada")
        return sucursalStr ? JSON.parse(sucursalStr) : null
    } catch (error) {
        console.error('Error parsing sucursal data:', error)
        return null
    }
}

/**
 * Creates headers for API requests including user and sucursal context
 * @returns {Object} Headers object with context information
 */
export const createApiHeaders = () => {
    const headers = {
        'Content-Type': 'application/json;charset=utf-8'
    }

    const user = getCurrentUser()
    if (user && user.idUsuario) {
        headers['X-User-Id'] = user.idUsuario.toString()
        
        if (user.esAdministrador) {
            const sucursal = getCurrentSucursal()
            if (sucursal && sucursal.idSucursal) {
                headers['X-Sucursal-Id'] = sucursal.idSucursal.toString()
            }
        }
    }

    return headers
}

/**
 * Makes an API request with appropriate headers
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise} Fetch promise
 */
export const apiRequest = async (url, options = {}) => {
    const headers = createApiHeaders()
    
    const requestOptions = {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    }

    return fetch(url, requestOptions)
}

/**
 * Makes a GET request with sucursal context
 * @param {string} url - API endpoint URL
 * @returns {Promise} Fetch promise
 */
export const apiGet = (url) => {
    return apiRequest(url, { method: 'GET' })
}

/**
 * Makes a POST request with sucursal context
 * @param {string} url - API endpoint URL
 * @param {Object} data - Request body data
 * @returns {Promise} Fetch promise
 */
export const apiPost = (url, data) => {
    return apiRequest(url, {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

/**
 * Makes a PUT request with sucursal context
 * @param {string} url - API endpoint URL
 * @param {Object} data - Request body data
 * @returns {Promise} Fetch promise
 */
export const apiPut = (url, data) => {
    return apiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

/**
 * Makes a PATCH request with sucursal context
 * @param {string} url - API endpoint URL
 * @param {Object} data - Request body data
 * @returns {Promise} Fetch promise
 */
export const apiPatch = (url, data) => {
    return apiRequest(url, {
        method: 'PATCH',
        body: JSON.stringify(data)
    })
}

/**
 * Makes a DELETE request with sucursal context
 * @param {string} url - API endpoint URL
 * @returns {Promise} Fetch promise
 */
export const apiDelete = (url) => {
    return apiRequest(url, { method: 'DELETE' })
}