function localType() {
    return window.localStorage[TypeName];
}
function toType(TypeName, object) {
    return window.localStorage[TypeName] = angular.toJson(object);
}
function fromType(TypeName) {
    return window.localStorage[TypeName] == undefined ? "" : JSON.parse(window.localStorage[TypeName]);
}
var header = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
var _MemberOnline = fromType("_MemberOnline");
var ContactPerson = fromType("ContactPerson");
var business = fromType("business");

angular.module('starter.controllers', ['fcsa-number'])
.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

})

.controller('AppHotelController', function ($scope, $state) {
    $scope.logout = function () {
        localStorage.clear();
        $state.go('intro');
        window.location.reload();
    }
})

.controller('loginController', function ($scope, $http, $ionicPopup, $state, $ionicViewService, $ionicLoading, $ionicPlatform, $rootScope, $cordovaNetwork) {
    $ionicLoading.show({ template: 'กรุณารอสักครู่...' });
    if (ionic.Platform.isWebView()) {
        $ionicPlatform.ready(function () {
            if ($cordovaNetwork.isOnline()) {

            } else {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: "แจ้งเตือน",
                    template: "กรุณาเปิดใช้งานอินเตอร์เน็ตบนอุปกรณ์ของคุณ.",
                    buttons: [
                   {
                       text: '<b>ตกลง</b>',
                       type: 'button-positive',
                       onTap: function (e) {
                           ionic.Platform.exitApp();
                       }
                   }
                    ]
                });
            }
        });
    }

    if (fromType("_MemberOnline") != "") {

        if (_MemberOnline.Business.Hotel.length >= 1) {
            $state.go('Hotel.Member');
        } else if (_MemberOnline.Business.Cigarette.length >= 1) {

        } else if (_MemberOnline.Business.Oil.length >= 1) {

        }
    }

    $ionicPlatform.registerBackButtonAction(function (e) {

        e.preventDefault();

        function showConfirm() {
            $ionicPopup.alert({
                title: '<strong>ข้อความ</strong>',
                template: 'คุณต้องการออกจาก แอพพลิเคชั่น?',
                buttons: [
               {
                   text: '<b>ตกลง</b>',
                   type: 'button-positive',
                   onTap: function (e) {
                       ionic.Platform.exitApp();
                   },

               },
               {
                   text: '<b>ยกเลิก</b>',
                   type: 'button-light'

               }

                ]
            });

            confirmPopup.then(function (res) {
                if (res) {
                    ionic.Platform.exitApp();
                } else {
                    // Don't close
                }
            });
        }

        // Is there a page to go back to?
        if ($ionicViewService.backView) {
            // Go back in history
            $ionicViewService.backView.go();
        } else {
            // This is the last page: Show confirmation popup
            showConfirm();
        }

        return false;
    }, 101);
    //$ionicViewService.nextViewOptions({
    //    disableBack: true
    //});
    AppKey = "";
    Id = "";
    Role = "";
    Business = {};
    SiteName = "";
    $scope.login = { UserName: "", Password: "" };
    var InConFunction = {
        siteload: function () {
            $http({
                method: 'POST',
                url: "http://develop.iconframework.com/eTax_api/api/SupAdmin/siteLoading_all",
                headers: header,
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: { '': '{}' }
            }).success(function (data) {
                $ionicLoading.hide();
                $scope.data = data.data;

            });
        }
    }
    $scope.ProvinceChange = function () {
        console.log($scope.Province);
    }
    var doLogin = function () {
        $ionicLoading.show({ template: 'กรุณารอสักครู่...' });
        var param = {
            "appKey": $scope.Province,
            "username": $scope.login.UserName,
            "password": $scope.login.Password
        };
        var jsonObj = JSON.stringify(param);
        $http({
            method: 'POST',
            url: "http://develop.iconframework.com/eTax_api/api/member/Authen",
            headers: header,
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: { '': jsonObj }
        }).success(function (data) {
            console.log(data);
            $ionicLoading.hide();
            if (data.status == 1) {
                _MemberOnline = data.data;
                toType("_MemberOnline", _MemberOnline);
                if (_MemberOnline.Business.Hotel.length >= 1) {
                    $state.go('Hotel.Member');
                } else if (_MemberOnline.Business.Cigarette.length >= 1) {

                } else if (_MemberOnline.Business.Oil.length >= 1) {

                } else {
                    $ionicPopup.alert({
                        title: 'เกิดข้อผิดพลาด',
                        template: "กรุณาเข้าสู่ระบบอีกครั้ง",
                        buttons: [
                       {
                           text: '<b>ตกลง</b>',
                           type: 'button-positive',
                           onTap: function (e) {
                               location.reload();
                           }
                       }
                        ]
                    });
                }
            }

            if (data.status != "1") {
                $ionicPopup.alert({
                    title: 'เกิดข้อผิดพลาด',
                    template: data.message
                });
            }
        });
    }
    $scope.doLogin = function () {
        if ($scope.Province == "img/iconuser.png") {
            $ionicPopup.alert({
                title: 'เกิดข้อผิดพลาด',
                template: 'กรุณาเลือกจังหวัด'
            });
        } else if ($scope.login.UserName == "") {
            $ionicPopup.alert({
                title: 'เกิดข้อผิดพลาด',
                template: 'กรุณากรอกรหัสประจำตัวประชาชนหรือเลขประจำตัวผู้เสียภาษี'
            });
        } else if ($scope.login.Password == "") {
            $ionicPopup.alert({
                title: 'เกิดข้อผิดพลาด',
                template: 'กรุณากรอกรหัสผ่าน'
            });
        } else {

            doLogin();
        }
    }
    $scope.init = function () {
        $scope.Province = 'img/iconuser.png';
        InConFunction.siteload();
    };
})

.controller('memberHotelController', function ($scope, $http, $state, $ionicLoading, $ionicPopup) {
    $ionicLoading.show({ template: 'กรุณารอสักครู่...' });

    var dateTH = new Date().toLocaleDateString('th-TH');
    var YearTH = dateTH.split('/')[2];
    var YearUS = (YearTH - 543).toString();
    var Month = dateTH.split('/')[1];
    $scope.YearOP = [{ "TH": YearTH - 1, "US": YearUS - 1 }, { "TH": YearTH, "US": YearUS }];
    $scope.Month = Month - 1 == 0 ? 12 : Month - 1;
    $scope.Year = Month - 1 == 0 ? YearUS - 1 : YearUS;
    $scope.form = {};
    var siteload = function () {
        var param = {
            "appKey": _MemberOnline.AppKey,
            "MemberId": _MemberOnline.Id,
            "BusinessId": _MemberOnline.Business.Hotel[0].Id
        };
        var jsonObj = JSON.stringify(param);
        $http({
            method: 'POST',
            url: "http://develop.iconframework.com/eTax_api/api/hotel/RequestPayment",
            headers: header,
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: { '': jsonObj }
        }).success(function (data) {
            $ionicLoading.hide();
            var data = data.data;
            business = data.Business[0];
            toType("business", business);
            angular.forEach(data.Personal, function (item, index) {
                if (item.PersonType == "Hotel Owner") {
                    ContactPerson = item;
                    toType("ContactPerson", ContactPerson);

                }
            });
            $scope.form = {
                "DueDate": data.PaymentDetail[0].DueDate,
                "FeeAmt": data.PaymentDetail[0].FeeAmt,
                "FineRate": data.PaymentDetail[0].FineRate,
                "TaxRate": data.PaymentDetail[0].TaxRate,
                "qty": data.PaymentDetail[0].qty,

            };
            $scope.SiteName = _MemberOnline.SiteName;
        });
    }
    $scope.click_save = function () {
        if ($scope.form.qty <= 0) {
            $ionicPopup.alert({
                title: 'ระบบ',
                template: "กรุณากรอกค่าเช่า",
                buttons: [
               {
                   text: '<b>ตกลง</b>',
                   type: 'button-positive',
               }
                ]
            });

        } else {
            var PaymentDetail = function () {
                return [
            {
                "TaxRate": $scope.form.TaxRate,
                "FeeAmt": $scope.form.FeeAmt,
                "FineRate": $scope.form.FineRate,
                "DueDate": $scope.form.DueDate,
                "qty": $scope.form.qty.toString(),
                "amt": $scope.form.qty,
                "Total": $scope.form.qty,
                "DayAmount": 0,
                "RoomAmount": 0,
                "RentAmount": $scope.form.qty.toString()
            }];
            };
            var item = {
                Business: business,
                User: _MemberOnline,
                PayMonth: $scope.Month,
                PayYear: $scope.Year,
                PaymentDetail: PaymentDetail(),
                ContactPerson: ContactPerson
            };
            var param = {
                "appKey": _MemberOnline.AppKey,
                "Data": item

            };
            var jsonObj = JSON.stringify(param);
            $ionicLoading.show({
                template: 'กรุณารอสักครู่...'
            });
            $http({
                method: 'POST',
                url: "http://develop.iconframework.com/eTax_api/api/hotel/taxsend",
                headers: header,
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: { '': jsonObj }
            }).success(function (data) {
                console.log(data);
                if (data.status == "1") {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'ระบบ',
                        template: "ยื่นภาษีเรียบร้อยแล้ว",
                        buttons: [
                       {
                           text: '<b>ตกลง</b>',
                           type: 'button-positive',
                           onTap: function (e) {
                               $ionicLoading
                           }
                       }
                        ]
                    });
                }
            });
        }
    }

    $scope.Param = {};
    $scope.init = function () {
        siteload();
    }
})

.controller('historyHotelController', function ($scope, $http, $state, $timeout, $ionicLoading, $cordovaFileTransfer, $ionicPopup) {
    $ionicLoading.show({ template: 'กรุณารอสักครู่...' });

    var output = [];
    var i = 1;
    var RStart = 0;
    $scope.data = [];
    $scope.more = true;
    $scope.siteload = function () {
        var param = {
            "draw": i,
            "columns": [
                {
                    "data": "Running",
                },
                {
                    "data": "CompCode",
                },
                {
                    "data": "PaymentDateFullDateText"
                },
                {
                    "data": "Amount"
                },
                {
                    "data": "StatusText"
                },
                {
                    "data": "ExpireDateFullDateText"
                }, {
                    "data": "ReceiptDateFullDateText"
                }],
            "order": [{ "column": 0, "dir": "asc" }],
            "start": RStart,
            "length": 3,
            "search": { "value": "", "regex": false },
            "appKey": _MemberOnline.AppKey,
            "refId": _MemberOnline.Id,
            "businessType": "hotel", "status": ""
        }
        var jsonObj = JSON.stringify(param);
        $http({
            method: 'POST',
            url: "http://develop.iconframework.com/eTax_api/api/member/paymenthistory_loadall",
            headers: header,
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: { '': jsonObj }
        }).success(function (data) {
            $ionicLoading.hide();

            var arr = [];
            var inputObj = data.data;
            if (data.recordsTotal < RStart) {
                $scope.more = false;
            } else {
                angular.forEach(inputObj, function (inputObj) {
                    $scope.data.push(inputObj);
                });
            }
        }).finally(function (data) {
            i++;
            RStart += 3;
            console.log($scope.data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    $scope.pdfLink = function (url) {
        //window.open('https://docs.google.com/gview?url=' + encodeURIComponent(url) + '&embedded=true', '_blank', 'location=yes');
        window.open('url&embedded=true', '_blank', 'location=yes');
        return false;
    }
    $scope.loadfiles = function (url) {
        if (ionic.Platform.isWebView() == true) {
            $ionicLoading.show({ template: 'กรุณารอสักครู่...' });
            $ionicPlatform.ready(function () {
                var filesname = url.substring(url.lastIndexOf("/") + 1, url.length);
                var targetPath = cordova.file.externalRootDirectory + "/Download/" + filesname + ".pdf";
                var trustHosts = true
                var options = {};
                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                  .then(function (result) {
                      // Success!
                      console.log(result);
                      $ionicLoading.hide();
                      $ionicPopup.alert({
                          title: 'ดาวน์โหลดเรียบร้อยแล้ว',
                          template: "โฟลเดอร์ : Download <br />ชื่อไฟล์ : " + filesname + ".pdf",
                          buttons: [
                         {
                             text: '<b>ตกลง</b>',
                             type: 'button-positive'
                         }
                          ]
                      });
                  }, function (err) {
                      $ionicPopup.alert({
                          title: 'ดาวน์โหลดไม่สำเร็จ',
                          template: "กรุณาลองดาวน์โหลดใหม่",
                          buttons: [
                         {
                             text: '<b>ตกลง</b>',
                             type: 'button-positive',
                         }
                          ]
                      });
                      console.log(err);
                      $ionicLoading.hide();
                  }, function (progress) {
                      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                      $ionicLoading.show({ template: 'กำลังดาวน์โหลด...<br />' + $scope.downloadProgress + "%" });
                      $timeout(function () {
                          $ionicLoading.hide();
                      })

                  });
            });

        }

    };
    $scope.init = function () {
    }
})
