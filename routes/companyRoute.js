const express = require('express');
const Company = require('../models/Company');
const Service = require('../models/Service');
const Promotion = require('../models/Promotion');
const User = require('../models/User'); 
const isDocumentReferenced = require('../functions/isDocumentReferenced');
const deleteImage = require('../functions/deleteImage');

const router = express.Router();

// POST: Add a company
router.post('/', async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).send(company);
  } catch (error) {
    res.status(500).send({ error: 'Failed to add company', details: error.message });
  }
});

// GET: Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve companies', details: error.message });
  }
});

// GET: Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).send({ error: 'company not found' });
    }
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve company', details: error.message });
  }
});

// PUT: Update a company by ID
router.put('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update company', details: error.message });
  }
});

// DELETE: Delete a company by ID
router.delete('/:id', async (req, res) => {
  try {
    const references = [
      { model: Promotion, field: 'company' },
      { model: Service, field: 'company' },
      { model: User, field: 'company' }
    ];
      const id_ = req.params.id;
      const isReferenced = await isDocumentReferenced(id_, references);
      if (isReferenced) {
        return res.status(404).send({ error: 'Cannot delete: Company is referenced in other collections(Promotion Or Service or User).'});
    }


   const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).send({ error: 'company not found' });
    }

    // Delete images 
    const public_id = company.public_id;
    
    if (public_id) {
      await deleteImage(public_id); 
    }
    // end delete images
    
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete company', details: error.message });
  }
});

module.exports = router;
