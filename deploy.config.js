module.exports = {
  apps: [
    {
      name: "JCWD-2302-01", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8302,
      },
      time: true,
    },
  ],
};
