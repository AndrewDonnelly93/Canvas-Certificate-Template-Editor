import {createContext} from "react";

// Store
import {makeAutoObservable} from "mobx";

// Api
import CertificateTemplates from "@src/services/api/accounts/CertificateTemplates";

export const CertificateTemplatesContext = createContext(null);

export class CertificateTemplatesStore {
  templates = [];

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Sets certificate templates
   * @param value
   */
  loadTemplates() {
    CertificateTemplates.list().then((result) => {
      this.setTemplates(result.data?.response);
    });
  }

  /**
   * Sets a list of certificate templates
   * @returns {*[]}
   */
  setTemplates(value) {
    this.templates = value;
  }

  /**
   * Returns certificate templates
   * @returns {*[]}
   */
  getTemplates() {
    return this.templates;
  }
}
