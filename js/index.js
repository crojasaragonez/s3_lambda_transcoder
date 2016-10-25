new Vue({
  el: '#app',
  data:{
    bucket: new AWS.S3({params: {Bucket: 'go-labs-videos'}}),
    status: '',
    loading: false,
    files: []
  },
  mounted: function() {
    this.loadFiles();
  },
  methods:{
    loadFiles: function () {
      var self = this;
      self.loading = true;
      self.bucket.listObjects(function (err, data) {
        if (err) {
          self.status = 'Could not load objects from S3';
        } else {
          self.status = 'Loaded ' + data.Contents.length + ' items from S3';
          self.files = data.Contents
        }
        self.loading = false;
      });
    },
    fileId: function (file) {
      return { Bucket: this.bucket.config.params.Bucket, Key: file.Key };
    },
    downloadFile: function (file) {
      this.bucket.getSignedUrl('getObject', this.fileId(file), function (err, url) {
        window.open(url, 'Download');
      });
    },
    deleteFile: function (file) {
      var self = this;
      self.loading = true;
      this.bucket.deleteObject(this.fileId(file), function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else  self.loadFiles();
        self.loading = false;
      });
    },
    convertToMp4: function (file) {
      var self = this;
      self.loading = true;
      var params = { FunctionName: 'convertVideo', Payload: JSON.stringify(self.fileId(file))};
      var lambda = new AWS.Lambda();
      lambda.invoke(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
        } else {
          self.loadFiles();
        }
        self.loading = false;
      });
    }
  }
});
