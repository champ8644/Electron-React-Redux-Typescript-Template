import Module from './module';

export const init = async (...modules: Module[]): Promise<void> => {
  await Promise.all(
    modules.map((module) =>
      module.init().catch((err) => {
        throw err;
      })
    )
  ).catch((err) => {
    console.error(
      `[ERROR] An error occured when loading ${module.constructor.name} could not be loaded:\n${err}`
    );
  });
};
