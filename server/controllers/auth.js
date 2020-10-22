const _ = require("lodash");
const { sendEmail } = require("../helpers");

const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');

const User = require('../models/user');


exports.signup = async (req,res) => {

    const userExists = await User.findOne({ email: req.body.email });
    if(userExists) return res.status(403).json({ 
        error: "Email already taken!" 
    });
    let user = await new User(req.body);
    console.log(req.body);
    console.log(user);
    //default profile pic
    const base64Data = 'LzlqLzRBQVFTa1pKUmdBQkFRQUFBUUFCQUFELzJ3QkRBQU1DQWdNQ0FnTURBd01FQXdNRUJRZ0ZCUVFFQlFvSEJ3WUlEQW9NREFzS0N3c05EaElRRFE0UkRnc0xFQllRRVJNVUZSVVZEQThYR0JZVUdCSVVGUlQvMndCREFRTUVCQVVFQlFrRkJRa1VEUXNORkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCVC93QUFSQ0FFQUFRQURBU0lBQWhFQkF4RUIvOFFBSFFBQkFBTUFBd0VCQVFBQUFBQUFBQUFBQUFjSUNRRUZCZ01FQXYvRUFFa1FBQUVEQXdJREJBUUpDQWtFQXdFQUFBRUFBZ01FQlFZSEVRZ1NJUWtUTVVFaVFsRmhGQmtqTWxkeGdZS1VGaGNrTTFKaWtkUVZHQ1ZqYzVLaHNzSkVaSEtpSmtPRHNmL0VBQlFCQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUQveEFBVUVRRUFBQUFBQUFBQUFBQUFBQUFBQUFBQS85b0FEQU1CQUFJUkF4RUFQd0RWTkVSQVJFUUVSRUJFUkFSUXp4QmNYdWx2RE5iblNacmtrVVYwY3puZ3NkRHRQY0p4NWNzUVBvZytUM2xyZjNsVEtUaXg0cHVOQ2Q5Rm9UZ3cwNXd1VnhZY3N1K3hlNXUreElua2J5RDN0aFpJOXY3WG1nMEsxQTFTdy9TbTBtNTVqazlweG1oMlBMTmRLeGtBZVI1TURpQzQrNXU1VlBOU3UyQTBneHFyZGJzS3RkKzFHdWpuY2tJb0tZMHROSTd3NVErVWQ0ZHo0Y3NUdDEwdW5uWklXTzczZjhwZGNzK3Z1cUdTVGJPbmliVlNRMDU5clhUT2NacEI3Q0hSK1BncmxhWmFFYWQ2TlViYWJDY01zMk5nTjVYVFVOSXhzOGcvZmxJTDNuM3VjVUZHUnhXOGEydGhBMDkwSnBzSnRzdlZsWmY0WE5sYTN5Y0pLcDhMSEQ2b2p2NUw2RGhrNDZkVFBsc3MxNXQySlJQL0FQb3MxUTZHVmc5bTFMQkczN2VjbGFQSWd6akhaUTUxa2Z5dVg4VFdWWGlWL3dDc1o4SG5rLzhBZVNyZHYvbFhQeEsrRlZQV3YxUHl1cmNmbkh1b0J2OEF4RGxvMmlET1Q0bGZDcWJyUWFvWlhTT0h6VDNVQjIvZ0dyZzlsRm5lT2ZLNGh4TjVWWjVXZnEyZHhQSC9BTzhkVzNiL0FDclJ4RUdjTHVHWGpwMHlQZllwcnhic3RpWi8wOTVxSFRTdkhzMnFvSkcvYnpncjVuaXU0MWRFeVJxSG9UVDVyYlllcjZ5d1F1ZEs1dm00eVVyNW1OSDF4RGJ6V2tTSUtLYWFkc0JvL2sxVzIzWnBiTDlwemRHdTd1WVY5TWFxbWpmNGN2UEVPOEd4OGVhSnV5dUhnR3FPSDZxMmdYVERzbnRPVFVIVG1tdGRZeWNNSjhuaHBKYWZjN1lycTlUZEI5TzlacU4xTm0yR1diSkFXOG9tcnFScnA0eCs1S0FIcyt0cmdxYTZoZGtoWkxQZC93QXBkRE0vdnVtR1NRN3VnaWRWU1RVNDlqV3pOYzJhTWUwbDBuaDRJTkJrV1prZkZueFM4R0U3S0xYZkJmemk0WkU0UmpMTFJzSHRidnNDWjQyOGg5elptUnZkNXU4MWM3aDk0dTlMZUptM0NYQ2NraG11YldkNVBZNjdhQzRVNDgrYUluMGdQTjdDNXY3eUNaVVJFQkVSQVJFUUVSRUJFUkFSRVFFUlE1eE9jVk9EOEttRHV2MlcxaGxyWnc1bHRzdEs0R3JyNUI1TWFmQm8zSE04K2kzY2VKSUJDU2N5elN3NmVZMVg1RGsxMnBMSFpLR1B2S211clpSSEZHMzNrK0pKNkFEcVNRQUNTczdzKzQ3TldPTGpMYXZUM2hZeDJxcExZeDNkMStjWENMdXU2WWVuTzB2QmJUdEkzSUx1YVZ3K2Excmd1aHdiUVhWL3RMTW5vdFFkYUsyc3dqU0tLVHY3TGl0RTR4dnFvL1ZkRzF3NkFnOWFoNExuQStnQTBndDBqMDYwMXhmU1RFcUxHY1BzbEpqOWpvMjdSVWxHemxHL201eDhYdlBtNXhMaWVwSlFWSjRkK3k0d2JUNjRESzlVcTErck9lMUVud2lvcUx1WFNVTWNwNmtpTjVKbmR2NHZtSjM2RU1hVmRpbnA0cVNDT0NDTmtNTWJReGtjYlExcldnYkFBRHdBSGt2b2lBaUlnSWlJQ0lpQWlJZ0lpSUNJaUQ1MUZQRlZ3U1FUeE1tZ2xhV1Bqa2FITmUwallnZzlDQ1BKVW00aCt5M3dmUDdpY3MwcnJwTkpjOXA1UGhGUFVXa3Vqb1h5anFDWTJFR0IyL2crRWdEcWVSeFYzVVFacTRCeDI2cjhKV1cwdW52RlBqdFZVMjU1N3VnemkzeGQ1M3JCMDUzRmdEYWhvR3hKYnRLMzFtT2NWb2hoMloyTFVIRzZISU1hdTFKZkxKWFI5N1RWMURLSklwRys0anpCNkVIcUNDRHNRdng2amFhWXZxNWlWYmpHWTJTa3lDeDFqZHBhU3NaekRmeWMwK0xIanljMGh3UFVFTE56T05COVlPelJ5ZXR6L1JtdHJNNDBnbGs3Kzg0dFd1TWo2V1AxblNOYVBBQWRLaGdEbWdiUGFXZ2x3YWtvb2Q0Wk9LakIrS3JCMjMvRXF3eDFrQWF5NVdXcWNCVjBFaDlWN1I0dE94NVhqMFhiSHdJSUV4SUNJaUFpSWdJaUlDSW9jNHFlSnpHdUZUU3VzeTIvT0ZWV3liMDlxdERIOHN0ZlVrYnRZUDJXanhjL2IwVyswbG9JZWU0eCtNZkYrRWJBeFgxNFpkc3N1TFhNczFnWkpzK29lT25lU2JkV1JOTzI3dlB3SFU5SzA4Sy9CUmxHdTJidDE3NG1POHZGOXJuTnFMUmlkYXphR2xpQjNqTTBKNk5ZTjkyVS9nUEdUZHhJWEhCUndyNUpydG5uOVpqWHRycm5mYms5dFhqZGlxbUVRMHNRNnd6bU0vTlkwZnFvejRENVE3dUlLMGJRY05hR05EV2dCb0d3QThseWlJQ0lpQWlJZ0lpSUNJaUFpSWdJaUlDSWlBaUlnTGh6UTlwYTRCelNOaUQ0RmNvZ3psNHArQ25LZEI4M2RyM3d6OTVhTDVRdWRVWGpFcUptOE5WRVR2SVlZUjBjdzdidmcrMlBad0FWbCtEbmpHeGZpNHdNM0NnRGJUbGR1YTFsNXNFajkzMHp6NFNSbnhmRTRnN084dkE3RWRiQnJPVGpXNFdNbDBIejMrc3hvSTExc3ZsdGU2cXlTdzByQ1lhcUk5WnB4R1BuTWNCOHF3ZjRnMmMwbEJvMmloM2hYNG04WjRxdEs2UExiQTRVdFl6YW51dHBlL21sb0trRGQwWjlyVDR0ZnQ2VFQ1RUVDWWtCRVJBUkVRZExtbVpXYlQzRTd0a3VRMTBWc3NscXBuMWRYVnpIMFk0MmpjbjJrK1FBNmtrQWJrck0vUVhCcjEybHZFZlc2ejZnVVVzR2tXSzFKcE1leCtvRzhkVTVwRG14dWI0T0E5R1NaM1VPY1d4OVdnaHZmY2R1ZjM3aTM0aE1kNFdOUGFwMGR0cDZobGJsdHlpOUtPTGsyZVd1MjZGc0xTSEZwUHBTdWpiMGMxYURhYWFjMkhTUEE3SmgrTTBUYUN4MmVtYlRVMEk4ZGg0dWNmV2U1eExuTzhTNXhQbWc5SzFvWTBOYUExb0d3QThBdVVSQVJFUUVSRUJFUkFSZFhsR1VXbkNzZXVOK3YxeHA3VFpyZkM2b3E2MnFlR1J3eHRHNWM0bFprNTV4WmEyY2ZHZFhEVDdoeXBLckZNRnBuZDFjY3VtYzZtbGtqUFRua21BSmdZNzFZNDk1WEFFbnB6TmFGNmRZK0wzUi9RU1NTbnpYTzdaYmJrd2JtMXdPZFZWZzltOEVRYzl1L2tYQUQzcXNXUTl0Rm90YktoME5zeDNNYnlHbjlleWpwNFkzZlZ6ejgzOFdoZHpvZDJTT2ttbjBVVnd6dDlYcVprYmozazB0d2tkQlJDUTlTV3dzZHU3cnZ2M2puNytPd1ZzTWEwVDA4dzJtWlQySEJNYnMwTFFBR1VOcGdoLzJzRzU5NkNtMlBkdEZvdGM2aHNOengzTWJNSEg5ZStqcDVvMi9YeVQ4MzhHbFdkMGM0dk5IOWU1STZmQ3M3dGx6dUx4dUxYTzUxTFdIMjdRU2hyM2JlWmFDUGV2WFpMb3RwOW1kTStuditEWTNlb1hEWXNyN1RCTVAvWmgyVlR0Y2V5UzBrMUJpbHVHQ09xOU04a2FlOGhsdDhqcDZJeURxQzZCN3QyOWR0dTdjemJ4MktDOGlMTGJBK0xQV3ZnSXpxMzZlOFIxSlZaWGd0Uzd1cmRsOExuVk1ySXgwNTJURUF6c2J2NlVjbTByUVFSdU9WcnROY1l5ZTA1cGoxdnZ0aXVGUGRyUGNJVzFGSlcwcncrS2FOdzNEbWtJTzBSRVFFUkVCRVJBWERtaDdTMXdEbWtiRUh3SzVSQmx0cnZnOTY3TkRpUW90WnNBbzVaOUlNcXFSU1pEajlNTm82VjdpWE9qYTN3YVBuU1F1NkJyZzZNN05JRHRMOE16R3o2ZzRwYWNseCt1aXVka3V0TXlycEt1RStqSkc0YmcrMEh5SVBVRUVIcUYrTFV6VGl3NnU0RmU4T3llaWJYMk84VXpxYXBoUGlBZW9lMCtxOXJnSE5kNGh6UWZKWjk4Q09mMzdoSzRnc2k0VjlRcXAwbHZucUgxdUpYS1gwWTVlZmQ0YXpmb0d6TUJjR2craksyUnZWemtHbGFJaUFvWjR2ZUlLazRadEJNa3pXVjBicnBISDhFdEZOSjRUMTBnSWlidDVodlY3aCt6RzVUTXN5K0xLU1hqUTQrTUYwSm9udm53ekMvN1N5TXhrOGpuYk1rbkJJOWpEREEwK3ErWjQ5cUNWdXkyNGQ2dlQvU3F0MVR5c1MxV2VhaHZOeW1xcXJyTXlqYzR2akJKOWFVdU16ajU4MGUvVnF1OHZuVDA4VkpUeFFRUnNoZ2lhR1J4eHREV3NhQnNBQVBBQWVTK2lBaUlnSWlJQ0lpQWlLR2VNWFdWK2dmRFhuV1owMG9pdWRKUW1udHp2TVZjemhEQzREejVYeUI1SHNhVUZHdUszTzhuNC9PS09sNGRkUHJnK2p3TEhhZ3k1SmRZZlNqa2tpY0JOSTdiNXpZbkVSc1o0T2xPNTZjcm02TGFQYVBZcm9SZ0ZzdzdEclpIYkxQUXMyMkFCa25rSUhOTks3YjA1SEVibHg5d0d3QUFxcDJTMmhrZW5QRG1NM3I0UzdJODVuZFh5enk5WkJTTWM1bE96ZjJPK1VsMzgrOUcvZ3J3SUNJaUFpSWc4VnJEbzlpdXUyQVhQRHN4dGtkenMxY3pZZzdDU0NRQThzc1R2RmtqU2R3NGZVZHdTRG5Yd241M2svQU54UTFYRG5xRGNIMW1CNURVQ1hHcnRONk1jY2tyaUlaR2IvTmJLNEdON1BCc28zSFF1YzdVbFVlN1dyUTJQVVhoME9jVytJdHlUQnFodGZGVVJkSkRTUGMxazdBUit6OG5MdjVkMGR2RkJlRkZEZkI5cksvWHpodHdYTktpUVMzT3NvUkJjWER4TlhDNHd6TzI4dVo4Ym5BZXh3VXlJQ0lpQWlJZ0lpSUNwRDJwSER4VjU5cFpRNnE0bUphVFBkUEhpNVExVkwwbWZSdGNIeWJFZXRFNENacDhnMlRicTVYZVh6cUtlS3NwNVlKNG1UUVN0TEpJNUdoelh0STJJSVBpQ1BKQkQzQ0p4QTBuRXpvTGplYlJPalpjNVl2Z2wycG8vQ25yb3dCTTNieUJPejJqOW1ScW1WWm1jSmNzdkJmeDdaMW9QV3ZmRGhtWi8ybmpabEo1R3UyZEpBQVQ3WXhOQTQrcytCZzlpMHpRZVcxU3orZzBwMDJ5Zk1ibVI4QnNWdW51RXJkOWk4UnNMZ3dlOXhBYVBlUXFROWtmcDVYM2pGOC8xeXlYOUl5VE83dk0yT3BlT3BoWkk1OHoybnlENTNQQkg5dzFkMzJ3T3BjK004Tjlyd3UzT2U2NlpwZUlhUHVJL255VThKRXJ3TnVwK1VGTzNiejUxYS9RYlRLbjBaMFl3dkNhZHJXaXlXdUNrbGN6d2ttRFFabi9la0wzZmVRZTlSRVFFUkVCRVJBUkVRRm4xMjArUXpXN2hzeGExUk9MRzNMSm9qTHQ2ekk2YWQzS2Z2RmgrNnRCVm54MjFPUHkxL0RkaWwxaWFYdHQrVHhObDI5VmtsTk9PWS9lYXdmZUNDN1drZU13NFhwVmh1UDA3QkhCYXJOUjBUR2diYkNPQmpCLy9BQmV0WGxOSjhraHpMUzNEci9UdkVrRjBzMUhXeHVCM0JiSkN4NC8zTDFhQWlJZ0lpSUM4bHE1ak1PYTZVNW5qOVF3U1FYV3pWbEM5cDh4SkE5aC8zTDFxOHBxeGtzT0c2V1pqZjZoNGpndFZtcks2UnhQUU5qZ2U4LzdVRkoreFp5S1c1Y05PVDJxVnhlTGJrODNkYitySEpUd081ZjhBTUhuN3kwRFdmZllzWS9MYitHdktickswc2JjY25tRVcvck1qcG9HOHcrOFhqN3EwRVFFUkVCRVJBUkVRRVJFR2ZIYTM2ZTNDell6cC9ybmpYNlBrbUNYZUZzdFEwZFJDK1JyNFh1UG1HVHRZQVA3OXl1L3BkbjlCcXBweGpHWTJzajRCZmJkQmNJbTc3bGdrWUhGaDk3U1MwKzhGZFZyM3BqVDZ6YUw1cGhOUXhydjZidGM5TENYK0VjeGFUQy83c2dZNzdxcWoyUDhBcVhQay9EZGNzTXVEbnR1bUYzaWFqTUVuejQ2ZVltVm0rL1VmS0dvYnQ1Y2lEdy9GZVB6MjlxRG9UcDRCMzl1eGVDTzhWVWJ1cld5Qno2dVJwSHNkSFMwNDkvTnN0STFtL3dBTW8vT2Iycit2R1Z6ZktSWTdSUzJ5SHpESlkzVTlJTnZaNk1NMzJrclNCQVJFUUVSRUJFUkFSRVFGQ25HYm8xSnIzd3o1M2g5SkYzMTFxS0g0VmJtRHhkVndPRTBUUWZMbWN3TTM5anlwclJCU1RzbWRjNHRUT0d5SEQ2eWIvd0NSWVBNYmRQREowZWFWN25QcG43ZXdEbmkvL0gzcTdheXg0bnNOeVRzOU9LeW00Z01GdDBsYnB4bEZRNkhJYlZCMGppa2xjSFRRbnlhSkhEdlluZUFrQmFlbXdkby9wUnF2aSt0bUIydk1NUHVrVjFzbHdqRDQ1V0gwNDNldEhJM3hZOXA2T2Flb0tEMTZJaUFpSWdLa25hemE1UmFhOE5rdUhVVTIrUlp4T0xkQkJHZDVCU3NjMTlRL2J6QkhKRi8rM3VWcmRWOVY4WDBUd082WmhtRjBpdE5rdDhmUEpLODd1a2Q2c2NiZkY3M0hvMW82a3JPRGhmd3pKTzBJNHFxbmlDenEzeVVPbldNVkRZY2R0VS9wUnl5Uk9Mb1ltK1RoRzQ5N0k3d2RJUTBkTncwTHljRzJqY21nbkRSZ21IVlVYYzNTbW9SVTNGcDhXMWM3ak5NMG56NVhTRmdQc1lGTktJZ0lpSUNJaUFpSWdJaUlDemM0VG0vbVM3VDdYZlRzajRQYnNuaGt2RkxHM28xMGhjeXJqYUI3R3gxVlFQZHk3TFNOWndjUzQvTmwyc09oT1ZRL0p3NUZReFd5YnlENVpIVkZJZC9iNk0wUDJnSVA2N0tFZmxIcTF4TlpmTDhwTGNjaGk1WlQrL1BXeXY4QTQ4ekQ5aTBkV2NmWXJmcE9tV3FOZWVycWpJbzkzZVoyaER2K2EwY1FFUkVCRVJBUkVRRVJFQkVSQjArWDRoWmMreGk1WTdrVnRwN3haTGxDNm5xNktxWnpSeXNQaUNQOVFSMUJBSUlJQ3pJekxobDF5N1BITnJqbk9nVlJWWnRwdFZQNzY0NHRPMTFSSkV3ZVVzTGRqSUdqNXM4V3p3Tnc0Y29KZHFlb2IxaDR3dEhOQ0paS2ZNODl0ZHZ1TWZ6clpUT2RWMWdQa0hRd2h6MjcrMXdBOTZDRE5DdTFoMGIxUXBvS1BMYW1iVFhJdm1TMDE0QmZSbC9ueVZMUnlnZjRnaisxV3p4clVyRWMwcG1WR1A1VlpiN1R2QUxaYmJjSWFocEI4Tml4eFdWZkVSeGdjTC9FSGVhbU9oNGZyN25tUVNiN1hhaWEyMDFVenZKeGtnTDVKQjdPOFlmcVZWN3J3MTVWbEZTNnB4YmgzMVh0dEpLZWFObFNaYXFOb1BnQS93RG82UGNmV1NnMzl5WFVqRXNMcG4xT1FaUlpiRlRzRzdwYmxjSWFkb0h2TDNBS3BtdXZhdzZONlgwMDlIaVZUTnFWa1hWa1ZMWndXVVlmNWM5UzRjcEgrR0pQc1dXZHE0YXN0eGVyRlRsWER4cXRjcUtJODBqS1lUVXNaSG52Si9SOG13K29oV240ZHVNVGhqNGU3dlRzdUhEM2ZNRHlHUGIrMWFybHU5VkM3emQzbFFZNUkvZjNiUjlTRDF1RzhNbXVQYUc1dmJzNjErcUtyQ2ROcVYvZlc3RllHdXA1WldIeWloZHU2TU9IenBwZDN1R3dhT1VndDAzeEhFYk5nV00yM0hzZXR0UGFMSmJZVzA5SlJVck9XT0pnOEFCL3FTZXBKSk81S2kvUi9qSDBhMTJraHA4UHoyMTF0eWwyRGJYVnZOSldPUHNiRE1HdmZ0N1dnajNxWjBCRVJBUkVRRVJFQkVSQVJFUUZuRjJyZy9KdlY3aGp5K0w1T1czWkRMenkremtxS0tWbjhPVjUrMWFPck9QdHFQMGJUVFM2dkhSMU5rVW16dk1id2wzL0FBUU94Vy9SdE10VWFBOUhVK1JSN3Q4eHZDRy84Rm80czR1eWhQNU9hdDhUZUlTL0p6VzdJWXVXSS91VkZiRS8rSEt3ZmF0SFVCRVJBUkVRRVJFQkVSQVVFY1R2R2ZwdHdwMmdQeXE1dXJNZ25pTWxGanR1MmtyS2dlQWNSdnRHemZmMDNrRG9kdVlqWlEzeHA4ZXRWcHhrRWVrV2psRTdMZFlybThVb2JTeGZDSTdVNXc2YnQ2aDgyM1VNUG9zSHBQNkRsUDV1RkhzNGFMRHIwTlROYmF6ODR1cWRlOFZrakxpLzRUUzBFcDY3K2x2MzByZW5wbjBXN0RrSG9oeENKS1dmaTU3UW1MNFJUMURkRE5KS3c3eHVZWklxaXJnUG1DT1dhbzNCOGQ0b25BK2FualJuc3FkRGRMV3hWZDZ0VlRxSGVoNlQ2cklwT2VEbTgrV21adEhzZlpKem4zcTQzZ3VVSFU0emlOaXd1MnN0MlBXVzNXSzNzK2JTV3lsanA0bS9VeGdBL3dCRjJ5SWdMcU1teEN4WnJiWDI3SWJKYnI5YjMvT3BMblNSMU1SK3Rqd1Ivb3UzUkJUZldmc3A5RGRVbXpWVmx0ZFRwNWVYZFdWV095Y3RQemVYTlRQM1pzUFpIeUgzcUJhbWJpNDdQUnBxcW1wR3VXa2xJZmxIU09rbG5wSVI1a25tbXA5Z1BIZVdKb1dvUzRJM0NDQ09HRGpSMDM0ckxPWDR2Y2pRNURCSHoxbU9YRWlPc2c5cm1qZmFXUGYxMkVqcU9ibEoyVThLakhGaDJiMURtTjVPcGVpVldOUE5VcUI1ckk0cmUvNE5TMThvNjdqbDI3aVUvdGowWEVubkhwRjQvVndWOGU5WHFSa011a2VzZENjUzFndGp6UzdWVVh3ZGwwYzBkUUc5QXlmYnFXRDBYajBtZER5Z0x1b2lJQ0lpQWlJZ0lpSUN6ajdhajlKMDAwdG9CMWRVNUZKczN6TzBQTC96V2ppemk3VncvbEpxL3dBTWVJUmZLUzNISVplZUwyODlSUlJNL2p6UEgySVA0NFpqK2JMdFlOZDhVbitUaXlLaGx1Y0k4QStXUjFQVmpiMitqTk45b0swZ1dibkZnZnpKZHAvb1JxSUQzRnV5ZUdPejFVanVqWFNGejZTUnhQc2JIVlU1OTNMdXRJMEJFUkFSRVFFUkVCVTM3UVhqSnJ0RExOYnRQTk8ydXVlcnVWOHRQUVU5TXp2WktDS1IzSTJiazY3eVBkNk1iU1BFRngzRGRuV0U0Z2RiTEp3OGFSWkZubCtQUFNXdURtaXBXdTJmVlR1UExGQzMzdWVRTi9JYms5QVZUVHMzOUI3M3FUbFY3NG85VW1DdXl6SjVwWDJHR1puU2xnTzdIVHNhZCtVRm83cUllVWJTZW9lQ0FsN2dVNElxSGhteDJYSmNtZTIrNnIzNWhsdTEybWQzcHB1Yzh6cWVKNTNKOUxxK1RmZDdodjRBQVd4UkVCRVJBUkVRRVJFQkVSQVZUT083Z2ZvZUpySEk4bHhoemJIcXRZbys5dFYxaGQzUnErUTh6YWVWNDJJNjlXU2I3c2NmWVNGYk5FRk51ejQ0eTYzWE96WERUdlVKcjdacTVpZ2RCWHdWVE82a3I0bzNjanB1VHB0S3gyelpHN2VKRGgwY1EyNUt6czdTTFFhOTZhWlZaT0tQU3hvb01yeG1hTjEraWdaMHFZUnN4dFE5bzI1Z0dudXBSNjBiZ2VnWVNibjhQdXRsazRoOUlzZHp5d25rcGJwQnZOU2wzTStscUdubGxoZDcydkJHL21OaU9oQ0NSRVJFQkVSQVJFUUZuQnhMSDg1dmF4YUZZckQ4cERqbERGYzV2TU1samRVVlozOW5vd3cvYVF0SDFtNXdtTy9QYjJudXZHb3BQd2kzWXpESlpxV1J2VnJaQTVsSkc0SDJPanBaejcrYmRCN2Z0Z2ROSjhuNGJyWm1sdmE5dDB3dThRMW5meC9QanA1aUluN2JkUjhvYWQyL2x5SzErZ3VwMVByTm92aGViVTdtdUY3dGNGVksxbmhITVdnVE0rN0lIdCs2dTExUndDZzFWMDN5ZkRyb0I4QXZ0dW50OHJ0dHl3U01MUThlOXBJY1BlQXFRZGtmcUZjTE5qT29HaG1UZm8rU1lKZDVuUlV6M2RSQytSekptTkhtR1R0ZVNmNzlxRFFkRVJBUkVRRVJlZDFHemkzNlo0QmtlVzNWM0xickhiNTdqUDEySlpGR1hsbzk1MjJIdklRWjQ4YWR3cmVNZmpRd1hod3M5VElNVHg1N2JyazgxT2ZCL0p6eWJud0JaQzVzYlQ1U1ZKQjhGcEpaclBSWTlhS0cxVzJsaW9yZFF3TXBxYW1oYnlzaGlZME5ZeG84Z0FBQVBjcy8reVF3RzRaRFpkUnRkc21iMytSWnZkNW9vYWw0Nm1Ga2hrbmN3L3N2bmVXN2Y5dUZvWWdJaUlDSWlBaUlnSWlJQ0lpQWlJZy9GZXJOUTVIWjY2MDNPbGpycmJYUVNVdFZTek41bVRSUGFXdlk0ZVlMU1FmcldiSEJUY2F6ZzM0MGM3NGNielV5dXhYSVpEYzhabXFEMEwrVG5qSVBodStBT2pjZk9TbmFCNHJUUlo0OXJoZ1Z3eHUxNmI2NzR5enVNaHdtN3d3ejFMQjE3bDBna2djOC9zc21aeTdmOXdVR2h5THptbkdjMEdwdW4rTjVkYXp2Yjc1Ym9MakFOOXkxc3NZZUduM2pmWSs4RmVqUUVSRUJFUkI0SFh6VTZEUmpSYk5jM3FIdGIvUWxybnFvUS93Zk9Ha1FzKzlJV04rOHFwZGovcHBOaS9EWmNjeXVESHV1bWFYZWF0TThuejVLZUVtRm0rL1UvS0NvZHY1ODY2THRiOVFiaGU4YjArMEx4bjlJeVBPN3ZDK1duYWZHRmtqV1FzY1BJUG5jMXdQOXc1WGgwdndHZzByMDR4bkRyV1AwQ3hXNkMzeE8yMkx4R3dONXo3M0VGeDk1S0QwNnpMNHRJNWVERGoyd1hYZWlZK0hETXovczNJeEVEeU5kczJPY2tEMnhpR2RvOVo4RHo3VnBvb2E0dStIMms0bWRCY2t3bVZzYkxuTEY4THROVEo0VTlkR0NZbmIrUVBWamorekk1Qk1OTlVSVmxQRlBCS3lhQ1ZvZkhKRzRPYTlwRzRJSThRUjVyNktrUFpiY1E5WG51bGxkcFZsaGtwYzkwOGViYk5TMVhTWjlHMXhaSHVENjBUZ1lYRHlEWTkrcmxkNUFSRVFGU3Z0Y2RTRGcvQ0hjTFJESnlWV1UzT2x0UTVUNlFqYTQxRWgrb2lBTlAvbjcxZFJabDlzVGRxMnF5YlJhMFJXSzRYMjFVTlZWWGE1VXRGQzUvZXNENEd0WnpCcERTV3RtSFg5cEJlUGhlMDBibzl3ODZmWWVJeEZQYkxQQTJxYUJ0K2t2YjNrNSsyVjhoKzFTaXM0L2pncW42QWNxL0ZuK1hUNDRLcCtnSEsveFovbDBHamlMT1A0NEtwK2dISy94Wi9sMCtPQ3Fmb0J5djhXZjVkQm80aXpqK09DcWZvQnl2OFdmNWRQamdxbjZBY3IvQUJaL2wwR2ppTE9QNDRLcCtnSEsvd0FXZjVkUGpncW42QWNyL0ZuK1hRYU9JczQvamdxbjZBY3IvRm4rWFQ0NEtwK2dISy94Wi9sMEdqaUxPUDQ0S3ArZ0hLL3haL2wwK09DcWZvQnl2OFdmNWRCbzRpemorT0NxZm9CeXY4V2Y1ZFBqZ3FuNkFjci9BQlovbDBHamlpdmluMHpickR3NmFoNGgzWWxudU5ubitDdEkzL1NZMjk3QWZzbFpHZnNWTi9qZ3FuNkFjci9GbitYVDQ0S3ArZ0hLdnhaL2wwRWtka2JxTzdPT0VTaHRNOHZlVk9MM1NxdFI1ajZYZEV0cUl6OVFFNWFQL0RieVYxRm1SMk9WeXJxUEpkYUxUTFk3aFlyVFcxRkpkTGRTMXNMbWQwem5xR3VadVdnT0lhNkVkUDJWcHVnSWlJQytWVFV4VWRQTFVUeXNnZ2lZWHlTeU9EV3NhQnVTU2ZBQWVhK3FwQjJwUEVOVjRIcGRRNlVZbDNsWG51b2J4Ym9hV2w2ek1vM3VESk5nUFdsY1JDMGVZZEp0MWFnaXZoSmlsNHorUFRPOWVhNWo1c053Myt6TWJiS0R5T2RzNk9BZ0gyUm1hWnc5Vjg3RDdGcG1vYjRSdUg2ajRaOUJjYndtRVJ2dVVVWHdxN1ZNZmhVVjBnQm1kdjVnSFpqVCt5eHFtUkFSRVFacWNkK0FYN2hMNGdzZDRxTlBhVjBsdm5xR1VlVzIyTDBZNWVmWmhjL2JvR3pNQWFYRWVqSzJOM1Z6bG9KcG5xUFlkWGNDc2VZNHhXdHI3SGVLWnRUVFREeEFQUXNjUFZlMXdMWE44bk5JOGwrM004T3Mrb09LWGJHc2dvWXJuWkxyVFBwS3VrbUhveVJ1R3hIdEI4d1IxQkFJNmhab2FFWnZldXpRNGtLM1JyUDZ5V28wZ3lxcE5WajEvcVR0SFN1Y1Exc2puZURSODJPWnZRTmNHeURacEpjR3BLTGhyZzlvYzBoelNOd1FlaEM1UUVSRUJFUkFSRVFFUkVCRVJBUkVRRVJFQkVSQVJFUUVSRUJFWERuQmpTNXhEV2dia2s3QUJCNW5VM1VpdzZRNEZmTXh5ZXRiUVdPejB6cW1wbVBpUU9nWTBlczl6aUd0YjV1Y0I1clB6Z1AwL3YzRmx4QVpIeFVhaFVybVVFVlEraXhLMnkrbEhGeTdzNW1iOUMyRmhMQTREMHBYU082T2F1ZzEwemE5ZHBqeElVZWptQTFrdFBvOWlsU0tySUwvQUU1M2pxbnRKYTZScnZCdytkSEMzcnpFdmtPN1J1M1RERGNQcytuK0tXbkc4Zm9ZclpaYlZUTXBLU2toR3pZNDJEWUQzbnpKUFVra25xVUhjb2lJQ0lpQW9kNHFPR1hHZUtyU3VzeEsvdEZMV01KcUxWZG1NNXBhQ3BBSWJJUGEwK0RtYitrMCtSQUltSkVHY25CVHhUWkxvTG52OVdmWHR6clplN2M5dExqZCtxbmt3MU1SNlF3R1EvT1k0ZnFubi9ET3ptZ0xSdFY4NHh1RG5GK0xqQXhiN2dXMm5LN2MxejdOZjQ0OTVLWjU4WTVCNHZpY2R0MitYaU5pT3RaK0Zuald5blFYTjI2Q2NUSGVXaTlVTG0wOW55MnRmdkRVeEU4c1ltbVBSN0R0c3lmN0pOaUNVR2phTGhyZzlvYzBoelNOd1FlaEM1UUVSRUJFUkFSRVFFUkVCRVJBUkVRRVJFQkVSQVJGdzV3WTB1Y1Exb0c1Sk93QVFjck9UalY0cGNsMTh6NytyTm9JNTF5dlZ4ZTZseVcvVXJ5SWFhRWRKb0JJTitWalFmbFhqL0RHNWNRdU9LWGpWeW5YM04zYUNjTTNlWGU4MXJuVTk0eTZpZnl3MDBRUExJSVpoMFl3YjdPbit5UGN1QlZtdURyZzZ4ZmhId0kyKzNsdDJ5cTROYSs4MytTUGFTcGVQQ05nOFdSTkpQSzN6Nms3a29QUThMUEROalBDdHBYUllqajdSVTFidHFpNlhaN0EyV3ZxU0FIU085alI0Tlp2NkxRUEVra3pDaUlDSWlBaUlnSWlJQ2g3aWE0V01INHFjSGRZTXRvakhXUUJ6N2JlcVVBVmRCSWZXWTQrTFRzT1poOUYydzhDQVJNS0lNdHNJMTIxZzdNL0o2UEFOWmFLc3puUithVHVMTmxORTB5UHBZL1ZiRzV4OEFCMXAza09hQnZHNHRBNXRJdE9OVGNXMWR4S2l5ZkRyNVNaQlk2c2J4VmRJL21BUG14d1BWang1dGNBNGVZQy9kbUdHMkxVSEc2N0g4bHROSmZMTFhSOTFVME5kRUpJcEcrOEh6QjJJSTZnZ0ViRUxPM1VEZ1AxVzRUTXRxdFF1RmZJNnVvb0hudks3QjdoTjNuZXNIWGthSGtOcUdnYmdCMjByZlZlNXhRYVZvcVFjUEhhazRSbmx4R0o2clVNbWt1ZTA4bndlb2d1d2RIUXZsSFFqdkhnR0IzdFpNQUIwSE80cTdWTlV3MWxQRlBUeXNuZ2xhSHh5eHVEbXZhUnVDQ09oQkhtZytxSWlBaUlnSWlJQ0lpQWlJZ0lpSUNMNVZOVERSVTh0UlVTc2dnaWFYeVN5dURXc2FCdVNTZWdBSG1xU2NRM2FrNFZndHgvSkxTZWdrMWF6Mm9rK0QwOEZxYStTaFpLZWdIZU1CZE9mM1lkd2VvNTJsQmJqVWpVN0Z0SU1ScmNuekcrVW1QMk9rRzhsWFZ2MkJQa3hqUjFlODdkR05CY2ZJRlp1NXJycHJEMm1PVDFtQmFPVWRaZ3VqME1uY1huS0sxcFkrcWo5WnNqbW56QjZVOFpKZHZ2STROUG8rZzArNERkVmVMRExhWFVQaW95T3Fob1dIdktIQjZDWVI5MHc5ZVIzSVMybmFRQUMxbThydldlMXdXaU9JWWRZOEF4dWh4L0c3VFNXU3kwTVlpcHFHaGlFY1ViZmNCNWs3a254SkpKM0pRUnh3emNMT0Q4SzJETngvRWFJdnE1dzE5eHZOVUFhdXZrQStjOXc4R2pjOHJCNkxkejVra3pBaUlDSWlBaUlnSWlJQ0lpQWlJZ0lpSUliNGdlRVhTN2lZdHhoemJHNFo3azFuSkJmS0xhQzRVNDh1V1lEZHdIN0R3NXY3cXBmTHdrOFVmQmhVUHJ0QnM3L09IaHNUakljU3UvS0hOYnZ1UUlKSGNoOTdvWHh2ZDVOV21pSU05OVBlMXZzOWt1L3dDVFd1bW4xOTB4eU9IWnM4MGRMSkxBUGE1MEx3MmFNZXdBU2VIaXJsYVk2KzZjYXowako4SXpXeTVKek41akJSMWJUVU1INzhKMmtaOVRtaGR2bjJsK0lhcVdnMnZNY1p0V1RVSFhsZ3VsR3ljTUo4Mjh3SmFmZU5pcWQ2bDlqL283bEZVKzRZYmNiN3AzZEE3dklUYjZvMVZORy94NXVTWGQ0MlBoeXlOMlFYclJadU40U3VOTFJJZzZkYTh3Wmxib2VqS0svd0F6M1NGdmsxc2RVeWFObytxUWJlUytnNGxPTzNUTDVIS3RDN1psOExQK290Tk9acFhqMjcwczcyL1ozWUtEUjlGbkVPMWExQ3h2NUxMK0dMS2JUS3o5WklKNmlMYjdrbElOdjh5NStPbXhDbTZWK2xlVlVqaDg0ZDlDZHY0OHFEUnhGbkg4ZExpTlQwb05LOHFxM0g1bzc2RWIvd0FPWmNIdFdkUThrK1N4RGhoeW02eXYvVnlHZW9sMys1SFNIZjhBeklOSFVXY0I0aytPN1UzNUhGdERMWmlFTC84QXFMdFRtR1dNZTNlcW5ZMzdPN0pYemR3azhhT3R1NTFHMTVndzIzVGRIMFZnbGVKQTN6YTZPbGJERzRmWElkL05CZVRVL1g3VGpSaWtmUG0rYTJYSE9Wdk1LZXNxMmlvZVAzSVJ2SS82bXRLcHRxRDJ0OXB2bDQvSm5RclQyKzZtNUhOdTJHYVNsa2lnUHNlMkZnZE5JUGFIQ1A2MTMybWZaQWFPWXRVc3VHWTNDKzZpWFF1N3lVM0NxTkxUU1A4QUhtN3VMWjUzUGlIU08zVnc4QzB3eERTeTBDMTRmak5xeG1nNmJ3V3VqWkFIa2VidVVBdVB2TzVRWjVSY0kzRkZ4blZESzdYck96cDloMGpoSU1TdEhLWEZ1KzRCZ2pkM1k5enBueVBiNXRWMGVIL2hIMHU0WjdhSWNKeHFHbnVUbys3bnZkYnRQY0tnZWZOTVJ1MEg5aGdhMzkxVEdpQWlJZ0lpSUNJaUFpSWcvOWs9';
    user.photo.data = Buffer.from(base64Data, 'base64');
    user.photo.contentType = 'image/jpg'

    await user.save();
    res.status(200).json({ message: "Signup success! Please Login. " });
};

exports.signin = (req,res) => {

    // find user by email
    const {email,password,notificationToken} = req.body;
    console.log(req.body);
    User.findOne({email}, (err, user) => {
        // if error or no user found
        if(err || !user){
            return res.status(401).json({
                error: "User with that email does not exist. Please signup. "
            });
        }
        // if user is found => match the password by userschema methods authenticate
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }

        if(notificationToken && notificationToken !== null){
            User.findOneAndUpdate({ email: user.email }, { $set: {"notificationToken": notificationToken} }, (err,result) => {
                if(err){
                    return res.status(401).json({
                        error: "Some error occurred! Please try again later."
                    })
                }
            })
        }
        
        //generate token with user id and secret 
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET );
        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        //return response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, email, name }});
    });
}

exports.signout = (req,res) => {
    res.clearCookie("t")
    return res.status(200).json({ message: "signout success! " })
}


exports.requireSignin = expressJwt({
    // if the token is valid, express jwt appends the verified users id
    // in an auth key to request object
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});


exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });

    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!"
            });

        // generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
            process.env.JWT_SECRET
        );

        // email data
        const emailData = {
            from: "noreply@socialapp.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${
                process.env.CLIENT_URL
            }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${
                process.env.CLIENT_URL
            }/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};


exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "Invalid Link!"
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};

exports.socialLogin = (req, res) => {
    // try signup by finding user with req.email
    let user = User.findOne({ email: req.body.email }, (err, user) => {
        if (err || !user) {
            // create a new user and login
            user = new User(req.body);
            req.profile = user;
            user.save();
            // generate a token with user id and secret
            const token = jwt.sign(
                { _id: user._id, iss: "NODEAPI" },
                process.env.JWT_SECRET
            );
            res.cookie("t", token, { expire: new Date() + 9999 });
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
        } else {
            // update existing user with new social info and login
            req.profile = user;
            user = _.extend(user, req.body);
            user.updated = Date.now();
            user.save();
            // generate a token with user id and secret
            const token = jwt.sign(
                { _id: user._id, iss: "NODEAPI" },
                process.env.JWT_SECRET
            );
            res.cookie("t", token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
        }
    });
};