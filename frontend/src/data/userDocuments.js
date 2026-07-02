/**
 * userDocuments.js
 * ─────────────────────────────────────────────────────────────
 * Simulates the user's existing documents stored in the system.
 * When filing a new letter, the SubmissionModal checks this store
 * and auto-attaches any matching documents.
 */

export const USER_DOCUMENTS = {
  ktp: {
    key: 'ktp',
    name: 'KTP (Kartu Tanda Penduduk)',
    fileName: 'KTP_BudiSantoso.jpg',
    fileSize: '1.2 MB',
    verified: true,
    uploadDate: '15 Mar 2024',
  },
  kk: {
    key: 'kk',
    name: 'KK (Kartu Keluarga)',
    fileName: 'KK_BudiSantoso.pdf',
    fileSize: '2.4 MB',
    verified: true,
    uploadDate: '15 Mar 2024',
  },
  aktaLahir: {
    key: 'aktaLahir',
    name: 'Akta Kelahiran',
    fileName: 'AktaLahir_BudiSantoso.pdf',
    fileSize: '3.1 MB',
    verified: true,
    uploadDate: '20 Mar 2024',
  },
  pasFoto: {
    key: 'pasFoto',
    name: 'Pas Foto 4×6',
    fileName: 'PasFoto_BudiSantoso.jpg',
    fileSize: '512 KB',
    verified: false,
    uploadDate: '22 Apr 2024',
  },
};

/**
 * Check whether a given requirement key is already available
 * in the user's document store.
 *
 * Keys that are NOT personal documents (like 'pengantar_rtrw')
 * are never "pre-existing" — they are generated during the flow.
 */
export const isDocumentAvailable = (requirementKey) => {
  // These keys are produced during the process, not uploaded
  const processGenerated = ['pengantar_rtrw', 'suratBidan', 'suratRS', 'aktaKematian', 'dokumenBedaNama'];
  if (processGenerated.includes(requirementKey)) return false;
  return !!USER_DOCUMENTS[requirementKey];
};

/**
 * Get the document object for a given key, or null.
 */
export const getDocument = (requirementKey) => USER_DOCUMENTS[requirementKey] || null;

/**
 * Produce a list of { requirement, key, available, doc } objects
 * for a service's requirement list.
 */
export const getRequirementStatus = (service) => {
  if (!service?.requirements || !service?.requirementKeys) return [];
  return service.requirements.map((req, i) => {
    const key = service.requirementKeys[i];
    const doc = getDocument(key);
    return {
      label: req,
      key,
      available: !!doc,
      doc,
    };
  });
};
