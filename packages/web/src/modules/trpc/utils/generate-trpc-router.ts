import { resolve } from 'path';
import { format, resolveConfig } from 'prettier';
import fg from 'fast-glob';
import fs from 'fs-extra';
import dedent from 'dedent';
import { trpcLog } from './create-logger';

export const generateTrpcRouter = async () => {
  const routers = (await fg('**/*.trpc.ts')).map(path => ({
    name: path.slice(path.lastIndexOf('/') + 1).replace('.trpc.ts', ''),
    importPath: path.replace('src', '@').replace('.ts', '')
  }));
  const routerImportBlocks = routers.map(
    ({ name, importPath }) => `import ${name}Router from '${importPath}';`
  );

  const routerBlocks = routers.map(({ name }) => {
    return dedent`.merge('${name}.', ${name}Router)`;
  });

  const outputPath = resolve(process.cwd(), 'src/generated/trpc-router.ts');
  fs.ensureFileSync(outputPath);

  const template = dedent`
  /* 
    THIS IS A GENERATED FILE. DO NOT EDIT
    This file is automatically generated when bootstraping the application
  */
  
  import { createRouter } from '@/modules/trpc/utils/create-router';
  ${routerImportBlocks.join('\n')}

  export const router = createRouter({middlewares: true})${routerBlocks.join(
    '\n'
  )};`;

  fs.writeFileSync(
    outputPath,
    format(template, {
      ...(await resolveConfig(outputPath)),
      parser: 'typescript'
    })
  );

  trpcLog('TRPC Router generated');
};
