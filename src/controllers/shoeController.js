const shoeService = require('../services/shoeService');
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

async function listShoes(req, res, next) {
  try {
    const shoes = await shoeService.getAllShoes(req.query);
    res.json({ success: true, count: shoes.length, data: shoes });
  } catch (err) {
    next(err);
  }
}

async function getShoe(req, res, next) {
  try {
    const shoe = await shoeService.getShoeById(req.params.id);
    res.json({ success: true, data: shoe });
  } catch (err) {
    next(err);
  }
}

async function createShoe(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
    }
    const shoe = await shoeService.createShoe(req.body);
    res.status(201).json({ success: true, data: shoe });
  } catch (err) {
    next(err);
  }
}

async function updateShoe(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
    }
    const shoe = await shoeService.updateShoe(req.params.id, req.body);
    res.json({ success: true, data: shoe });
  } catch (err) {
    next(err);
  }
}

async function deleteShoe(req, res, next) {
  try {
    const result = await shoeService.deleteShoe(req.params.id);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listShoes,
  getShoe,
  createShoe,
  updateShoe,
  deleteShoe,
};
