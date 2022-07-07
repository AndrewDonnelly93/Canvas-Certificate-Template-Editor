import {createContext} from "react";

// Store
import {makeAutoObservable} from "mobx";

// Api
import CertificateTemplates from "@src/services/api/accounts/CertificateTemplates";

export const LanguageCertificateTemplatesContext = createContext(null);

export class LanguageCertificateTemplatesStore {
  templates = [];
  gallery = [];

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Sets a list of language certificates for a particular template
   * @param certificateTemplateId
   */
  loadTemplates(certificateTemplateId) {
    CertificateTemplates.languageCertificateTemplates(certificateTemplateId).then((result) => {
      this.setTemplates(result.data?.response);
    });
  }

  /**
   *  Loads a gallery
   * @param certificateTemplateId
   * @param certificateTemplateLangId
   */
  loadGallery(certificateTemplateId, certificateTemplateLangId) {
    CertificateTemplates.gallery(certificateTemplateId, certificateTemplateLangId).then((result) => {
      this.setGallery(result.data?.response);
    });
  }

  /**
   * Sets a gallery for the current language certificate
   * @param value
   */
  setGallery(value) {
    this.gallery = value;
  }

  /**
   * Returns a list of images
   * @returns {*[]}
   */
  getGallery() {
    return this.gallery;
  }

  /**
   * Sets a list of language certificate templates
   * @returns {*[]}
   */
  setTemplates(value) {
    this.templates = value;
  }

  /**
   * Returns a list of language certificates for a particular template
   * @returns {*[]}
   */
  getTemplates() {
    return this.templates;
  }
}
