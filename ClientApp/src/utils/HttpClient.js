/**
 * HTTP client wrapper that automatically adds sucursal context headers
 */
class HttpClient {
  static getSucursalId() {
    const savedSucursal = window.localStorage.getItem("sucursal_actual");
    if (savedSucursal) {
      const sucursal = JSON.parse(savedSucursal);
      return sucursal?.idSucursal || null;
    }
    return null;
  }

  static isAdministrator() {
    const savedUser = window.localStorage.getItem("sesion_usuario");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user?.esAdministrador || false;
    }
    return false;
  }

  static getDefaultHeaders() {
    const headers = {
      "Content-Type": "application/json;charset=utf-8",
    };

    // Add sucursal header for administrators
    if (this.isAdministrator()) {
      const sucursalId = this.getSucursalId();
      if (sucursalId) {
        headers["X-Sucursal-Id"] = sucursalId.toString();
      }
    }

    return headers;
  }

  static async fetch(url, options = {}) {
    const defaultOptions = {
      headers: this.getDefaultHeaders(),
    };

    // Merge headers with custom ones
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(url, mergedOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error("HTTP request failed:", error);
      throw error;
    }
  }

  static async get(url, options = {}) {
    return this.fetch(url, { ...options, method: "GET" });
  }

  static async post(url, data, options = {}) {
    return this.fetch(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async put(url, data, options = {}) {
    return this.fetch(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async delete(url, options = {}) {
    return this.fetch(url, { ...options, method: "DELETE" });
  }
}

export default HttpClient;