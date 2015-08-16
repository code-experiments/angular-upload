angular.module('mooshak', [])
	.controller('MainCtrl', ['$scope', '$http', function($scope, $http){/*
	 Function to carry out the actual PUT request to S3 using the signed request from the app.
	 */
	function upload_file(file, signed_request, url) {
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", signed_request);
		xhr.setRequestHeader('x-amz-acl', 'public-read');
		xhr.onload = function () {
			if (xhr.status === 200) {
				document.getElementById("preview").src = url;
				document.getElementById("avatar_url").value = url;
			}
		};
		xhr.onerror = function () {
			alert("Could not upload file.");
		};
		xhr.send(file);

		//var req = {
		//	method: 'PUT',
		//	url: signed_request,
		//	headers: {
		//		'x-amz-acl': 'public-read',
		//		'Content-Type': 'multipart/form-data'
		//	},
		//	data: { file: file },
		//	transformRequest: function (data, headersGetter) {
		//		var formData = new FormData();
		//		angular.forEach(data, function (value, key) {
		//			formData.append(key, value);
		//		});
		//
		//		var headers = headersGetter();
		//		delete headers['Content-Type'];
		//
		//		return formData;
		//	}
		//};
		//$http(req).success(function(){
		//	document.getElementById("preview").src = url;
		//	document.getElementById("avatar_url").value = url;
		//});
	}

	/*
	 Function to get the temporary signed request from the app.
	 If request successful, continue to upload the file using this signed
	 request.
	 */
	function get_signed_request(file) {
		$http.get("/sign_s3?file_name=" + file.name + "&file_type=" + file.type).then(function(response){
			var res = response.data;
			upload_file(file, res.signed_request, res.url);
		});
	}
		$scope.uploadFile = function(event){
			var files = event.target.files;
			var file = files[0];
			if (file == null) {
				alert("No file selected.");
				return;
			}
			get_signed_request(file);
		};

}]).directive('fileOnChange', function(){
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var onChangeHandler = scope.$eval(attrs.fileOnChange);
				element.bind('change', onChangeHandler);
			}
		};
	});