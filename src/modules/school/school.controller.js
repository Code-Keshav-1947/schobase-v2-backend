const schoolService = require("./school.service");
const schoolValidation = require("./school.validation");
const { errorHandler } = require("../../utils/errors/index");

const getAllSchools = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const schools = await schoolService.getAllSchools(page, limit, search);
    res.status(200).json(schools);
  } catch (error) {
    next(error);
  }
};

const createSchool = async (req, res, next) => {
  try {
    const schoolData = req.body;
    const school = await schoolService.createSchool(schoolData);
    res.status(201).json(school);
  } catch (error) {
    next(error);
  }
};

const getSchoolById = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { id } = req.params;
    const school = await schoolService.getSchoolById(id, role);
    res.status(200).json(school);
  } catch (error) {
    next(error);
  }
};

const updateSchool = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schoolData = req.body;

    const school = await schoolService.updateSchool(id, schoolData);
    res.status(200).json(school);
  } catch (error) {
    next(error);
  }
};

const deleteSchool = async (req, res, next) => {
  try {
    const { id } = req.params;
    await schoolService.deleteSchool(id);
    res.status(201).send({
      message: "School deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSchool,
  getSchoolById,
  updateSchool,
  deleteSchool,
  getAllSchools,
};
