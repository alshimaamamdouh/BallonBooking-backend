
const mongoose = require('mongoose');

async function isDocumentReferenced(documentId, references) {
  for (const { model, field } of references) {
    const count = await model.countDocuments({ [field]: documentId });
    if (count > 0) return true; 
  }
  return false;
}

module.exports = isDocumentReferenced;