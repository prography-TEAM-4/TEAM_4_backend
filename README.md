swagger setting,<br/>
crlf setting remove delete 'cr'<br/>
hot reloading,<br/>
[nest swagger](https://docs.nestjs.com/openapi/introduction)<br/>
git ignore .env<br/>
import * as library from "library" => import library from "library"로 가능하게 됨.<br/>

to use typeorm put<br/>
keepConnectionAlive: true<br/>
inside of TypeORM configuration<br/>

when using fastify-swagger or helmet will cause CSP problem.

```
app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [`'self'`, `'unsafe-inline'`],
      imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
    },
  },
});

// If you are not going to use CSP at all, you can use this:
app.register(helmet, {
  contentSecurityPolicy: false,
});
```
