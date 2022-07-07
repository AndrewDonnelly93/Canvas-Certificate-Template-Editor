import {get, post} from "@src/config/axios";
// Store
import store from "@src/store/Store";

const user = store.user.getUser();
const accountId = (user?.account_id) ? user.account_id : '0';
const token = store.user.getToken();
// Account url
const url = `/accounts/${accountId}/certificates/templates`;

/**
 * Certificate templates api
 * @type {{list: (function(*, *=, *=, *=): Promise)}}
 */
const CertificateTemplates = {
  /**
   *  Returns a list of all certificate templates
   * @returns {Promise<T>}
   */
  list: () => get(`${url}`),

  /**
   * Returns a list of LanguageCertificateTemplates for a
   * particular certificateTemplate
   */
  languageCertificateTemplates: (certificateTemplateId, language) => {
    const certLanguage = language !== undefined ? {lang: language} : {};
    return get(`${url}/${certificateTemplateId}/langs`, {
      params: {
       ...certLanguage
      }
    })
  },

  uploadImage: (certificateTemplateId, imageFile) => {
    // const formData = new FormData();
    // formData.append(imageFile);
    return post(`${url}/${certificateTemplateId}/images`, {
      data: imageFile
    })
  },

  gallery: (certificateTemplateId, certificateTemplateLangId) => {
    return get(`${url}/${certificateTemplateId}/langs/${certificateTemplateLangId}/images`, {
      params: {
        token: token,
      }
    })
  },

  /**
   * Apply a certificate template to an array of courses
   * @param certificateId
   * @param courses
   * @returns {Promise}
   */
  applyCourses: (certificateId, courses) => post(`${url}/${certificateId}/apply_to_courses`,
    {
      courses
    }),

  /**
   * Get a list of courses to which the current certificate template
   * is assigned
   * @param certificateId
   * @returns {Promise}
   */
  appliedCourses: (certificateId) => get(`${url}/${certificateId}/apply_to_courses`, {
    params: {
      token
    }
  }),


}

export default CertificateTemplates;
