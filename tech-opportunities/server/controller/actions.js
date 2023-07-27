const { User, Job } = require('../../db/models');

module.exports = {
  searchJobs: async(req, res) => {
    try {
      const { title, location, keywords } = req.query;

      // build search query based on user input
      const where = {};

      if (title) {
        where.title = { [ Op.iLike ]: `%${ title }%` };
      }
      if (location) {
        where.location = { [ Op.iLike ]: `%${ location }%` };
      }
      if (keywords) {
        where[ Op.or ] = [
          { title: { [ Op.iLike ]: `%${ keywords }%` } },
          { company: { [ Op.iLike ]: `%${ keywords }%` } },
        ];
      }

      // exec search query using Job model
      const jobs = await Job.findAll({ where });
      res.status(200).json(jobs);

    } catch (err) {
      res.status(500).json({ error: `Could not perform job search: ${ err.message }` });
    }
  },

  saveJob: async(req, res) => {
    try {
      const { userId, jobData } = req.body;

      // find user in DB
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: `User not found` });
      }

      // create & save job
      const savedJob = await Job.create(jobData);
      await user.addJob(savedJob);

      res.status(201).json({ message: `Job saved successfully` });

    } catch (err) {
      res.status(500).json({ error: `Error saving job: ${ err.message }` });
    }
  },

  getSavedJobs: async(req, res) => {
    try {
      const { userId } = req.params;

      // find by ID & include saved jobs data
      const user = await User.findByPk(userId, { include: Job });

      if (!user) {
        res.status(404).json({ error: `User not found` });
      }

      res.status(200).json({ savedJobs: user.Jobs });

    } catch (err) {
      res.status(500).json({ error: `Error fetching saved jobs: ${ err.message }` });
    }
  },

  deleteSavedJob: async(req, res) => {
    try {
      const { jobId, userId } = req.params;

      // find by ID
      const user = await User.findByPk(userId);

      if (!user) {
        res.status(404).json({ error: `User not found` });
      }

      // remove job w/ specified ID
      await user.removeJob(jobId);

      res.status(200).json({ message: `Job removed from saved list` });

    } catch (err) {
      res.status(500).json({ error: `Error deleting saved job: ${ err.message }` });
    }
  }
};