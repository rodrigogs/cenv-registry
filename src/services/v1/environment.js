const debug = require('debug')('app:services:v1:environment');
const _ = require('lodash');

const NotFoundError = require('../../errors/notFound');
const Environment = require('../../models/v1/environment');
const Variable = require('../../models/v1/variable');

const EnvironmentService = {

  /**
   *
   * @return {Promise|Array|{index: number, input: string}|*}
   */
  list: () => {
    debug('listing environments');

    return Environment.find({}).exec();
  },

  /**
   *
   * @param name
   * @return {Promise}
   */
  findByName: async (name) => {
    debug(`looking for environment "${name}"`);

    const env = await Environment.findOne({ name }).exec();
    if (!env) throw new NotFoundError(`Environment "${name}" not found`);

    return env.populate('variables').execPopulate();
  },

  /**
   *
   * @param body
   * @return {Promise.<void>}
   */
  create: async (body) => {
    debug(`creating environment "${body.name}"`);

    const env = new Environment(body);
    await env.save();
    return env;
  },

  /**
   *
   * @param environment
   * @param body
   * @return {Promise.<*|Promise>}
   */
  update: async (environment, body) => {
    debug(`updating environment "${environment}"`);

    const env = await EnvironmentService.findByName(environment);

    const promises = _.map(body, (value, name) => {
      const variable = env.variables.find(v => v.name === name);
      if (!variable) {
        return EnvironmentService.createVar(environment, name, value);
      }
      return EnvironmentService.updateVar(environment, name, value);
    });

    await Promise.all(promises);
    return EnvironmentService.findByName(environment);
  },

  /**
   *
   * @param name
   * @return {Promise.<Promise|Array|{index: number, input: string}|*>}
   */
  delete: async (name) => {
    debug(`deleting environment "${name}"`);

    return Environment.remove({ name }).exec();
  },

  /**
   *
   * @param environment
   * @param name
   * @return {Promise.<T>}
   */
  getVar: async (environment, name) => {
    debug(`retrieving variable "${name}"`);

    const env = await EnvironmentService.findByName(environment);

    const variable = env.variables.find(v => v.name === name);
    if (!variable) throw new NotFoundError(`Variable "${name}" not found`);

    return variable;
  },

  /**
   *
   * @param environment
   * @param name
   * @param value
   * @return {Promise.<*>}
   */
  createVar: async (environment, name, value) => {
    debug(`creating variable "${name}" with value "${value}"`);

    const env = await EnvironmentService.findByName(environment);

    const dup = env.variables.find(v => v.name === name);
    if (dup) throw new Error('Given variable name is already in use for this environment');

    const variable = new Variable({ name, value });
    await variable.save();
    env.variables.push(variable);
    await env.save();
    return env;
  },

  /**
   *
   * @param environment
   * @param name
   * @param value
   * @return {Promise.<*>}
   */
  updateVar: async (environment, name, value) => {
    debug(`updating variable "${name}" with value "${value}"`);

    const variable = await EnvironmentService.getVar(environment, name);
    if (!variable) throw new NotFoundError(`Variable "${name}" not found`);

    variable.value = value;
    await variable.save();
    return variable;
  },

  /**
   *
   * @param environment
   * @param name
   * @return {Promise.<Promise|Array|{index: number, input: string}|*>}
   */
  deleteVar: async (environment, name) => {
    debug(`deleting variable "${name}"`);

    const variable = await EnvironmentService.getVar(environment, name);
    if (!variable) throw new NotFoundError(`Variable "${name}" not found`);

    return Variable.remove({ _id: variable._id }).exec();
  },

};

module.exports = EnvironmentService;
