
'use strict';
const { WebTracerProvider } = require('@opentelemetry/web');

const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const opentelemetry = require('@opentelemetry/sdk-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector');
const tracerProvider = new WebTracerProvider();
const traceExporter = new CollectorTraceExporter({
  url: 'API_URL',
  headers: {
    'Lightstep-Access-Token': 'API_KEY'
  },
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'example-service',
  }),
});

tracerProvider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
tracerProvider.register();
const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

const PORT = 8090;
sdk.start()
  .then(() => {
    const express = require('express');
    const app = express();
    app.use(express.json());

    app.get('/', (req, res) => {
      res.send('running...');
    });

    app.get('/ping', (req, res) => {

      res.send('pong');
    });

    app.listen(PORT);
    console.log(`Running on ${PORT}`);
  })