(function initialFunc(){

		/*window.onerror = function (msg, url, lineNo, columnNo, error) {
			$('.log').append(msg+' <br />');
		  return false;
		}*/
		  
		let primary_labels=[];
		let secondary_labels=[];
		
		let all_aims = {};
		let all_drives = {};
		let aims_labels=[];
		let checkedAims=[];
		let checkedDrives = {primary:[],secondary:[]} ;
		let cvgWidth  = document.getElementById('page-board').clientWidth;
		let cvgHeight = cvgWidth;
		let scoreBoardID ;
		
		$('.drives_checkbox').prop('checked',false);
		$('.aims_checkbox').prop('checked',false);
			
		@foreach($aims as $aim)
			all_aims[{{$aim->id}}] = {name:"{{__($aim->aim_name)}}",status:1}; //Status: 1=>important, 2=>somehome imoprtant ;
		@endforeach
		
		
		
		
		@foreach($drives as $drive)
			all_drives[{{$drive->id}}] = {name:"{{__($drive->drive_name)}}",status:1,x:$('#circle_{{$drive->id}}').attr('cx'),y:$('#circle_{{$drive->id}}').attr('cy')}; //Status: 1=>primary, 2=>secondary ;
		@endforeach
		
		$('#svg1').css('height',cvgWidth+'px');
		;
		$('button[name="savePDF"]').click(function(){
			
			if(typeof scoreBoardID != 'undefined'){
				window.open('{{config("app.url")}}/pdf/'+scoreBoardID+'/true','_blank');
			}
			
		});
		
		$('button[name="dbSuggest"]').click(function(){
			$('.dbSuggestFile').show();
		});
		$('button[name="suggestUpload"]').click(function(){
			$('.dbSuggestFile').hide();
			$('#suggestAlert').show();
			setTimeout(function(){
					$('#suggestAlert').fadeOut();
				},5000);
		});
		
		function renderSVG(renderWidth=600,renderHeight=600){
			 var canvas = document.getElementById("canvas");
			 var ctx = canvas.getContext("2d");
		 	 ctx.fillStyle = "blue";
		 	 ctx.fillRect(0, 0, canvas.width, canvas.height);
			 
			 $('#canvas').attr('width',renderWidth+'px').attr('height',renderHeight+'px');
			 
			 calculate_chart('#svg1',renderWidth,renderHeight,'2em');
			 canvg('canvas','<svg style="background-color:#fff">'+$('#svg1').html()+'</svg>'); 
			 
			 
			 var canvas = document.getElementById('canvas'); 
			 var ctx = canvas.getContext("2d");


			 vh_x = $('#vertical-hint').attr('x');
			 vh_x = Number(vh_x.substring(0,vh_x.length-1));
			 vh_x = Math.floor(vh_x*renderWidth/100);
			 vh_y = $('#vertical-hint').attr('y');
			 vh_y = Number(vh_y.substring(0,vh_y.length-1));
			 vh_y = Math.floor(vh_y*renderHeight/100);
			 vh_width = $('#vertical-hint').attr('width');
			 vh_width = Number(vh_width.substring(0,vh_width.length-1));
			 vh_width = Math.floor(vh_width*renderWidth/100)
			 vh_height = $('#vertical-hint').attr('height');
			 vh_height = Number(vh_height.substring(0,vh_height.length-1));
			 vh_height = Math.floor(vh_height*renderWidth/100)
			 ctx.drawImage(document.getElementById('vertical-hint'),vh_x,vh_y,vh_width,vh_height);
			 
			 hh_x = $('#horizontal-hint').attr('x');
			 hh_x = Number(hh_x.substring(0,hh_x.length-1));
			 hh_x = Math.floor(hh_x*renderWidth/100);
			 hh_y = $('#horizontal-hint').attr('y');
			 hh_y = Number(hh_y.substring(0,hh_y.length-1));
			 hh_y = Math.floor(hh_y*renderHeight/100);

			 hh_width = $('#horizontal-hint').attr('width');
			 hh_width = Number(hh_width.substring(0,hh_width.length-1));
			 hh_width = Math.floor(hh_width*renderWidth/100)
			 hh_height = $('#horizontal-hint').attr('height');
			 hh_height = Number(hh_height.substring(0,hh_height.length-1));
			 hh_height = Math.floor(hh_height*renderWidth/100)			 
			 ctx.drawImage(document.getElementById('horizontal-hint'),hh_x,hh_y,hh_width,hh_height);
			 
			 
			 //var img = canvas.toBlob
	
			 calculate_chart('#svg1',cvgWidth,cvgHeight,'1em');
			 
			 return canvas ;
		};
		
		
		
		function updateAimsList(){
			checkedAims = [];
			$('.aims_checkbox:checked').each(function(){
				all_aims[$(this).attr('data-aim-checkbox')].status=$(this).val();
				 checkedAims.push($(this).attr('data-aim-checkbox'));
			 });
		}
		function updateDrivesList(){
			checkedDrives = {primary:[],secondary:[]} ;
			$('.drives_checkbox:checked').each(function(){
				 if($(this).val()==1){
					 checkedDrives.primary.push($(this).attr('data-drive-id'));
				 }else{
					 checkedDrives.secondary.push($(this).attr('data-drive-id'));
				 }
			 });
			 
		}
		function pageBoardAdjust(){
			console.log($(window).width());
			if($(window).width()<480){
				//$('.intro-extro').hide();
				
				$('.aims_category').css('transform','rotate(-90deg)');
				$('.aims_col1').width('70%');
				$('.aims_col3').width('25%');
				$('.name-input').css('margin-top','30px').css('font-size','0.8em');
				$('.text-constant').attr('font-size','.6em');
			}else{
				$('.aims_category').css('transform','rotate(0)');
				$('.aims_col1').width('40%');
				$('.aims_col3').width('55%');
				$('.name-input').css('margin-top','0').css('font-size','0.9em');
				$('.text-constant').attr('font-size','1em');
			}
			
			if($(window).width()<559){
				$('.prim-2').hide();
				$('.test-container').css('background-color','#f8f7ef')
				$('.page-board').removeClass('page-board-shadow');
				
			}else{
				$('.prim-2').show();
				$('.test-container').css('background-color','#FFFFFF');
				$('.page-board').addClass('page-board-shadow');
				
			}
			
				
			if($(window).width() < 990) {				
				$('#mindgrid-form').addClass('mobile-fontsize');
				$('.page-board-clip').addClass('page-board-clip-mobile');
				$('#score-board').addClass('mobile-fontsize');
			
			}else{
				$('#mindgrid-form').removeClass('mobile-fontsize');
				$('.page-board-clip').removeClass('page-board-clip-mobile');
				$('#score-board').removeClass('mobile-fontsize');
			}
			
			 cvgWidth  = document.getElementById('page-board').clientWidth;
			 cvgHeight = cvgWidth;
			 $('#svg1').css('height',cvgWidth+'px');
			 
			// console.log(document.getElementById('svg1').clientWidth);
			 
			 calculate_chart('#svg1',cvgWidth,cvgHeight);
			 

		}
		pageBoardAdjust();
		$(window).on('resize', function() {
			pageBoardAdjust();
			
		})
		
		$('.aims_info').click(function(){
			var aim_id= $(this).attr('data-aim-id');
			aim_text = $(this).attr('data-text');
			$('#modal-wrapper').css('width',$(window).width()).css('height',$(window).height()).show();
			$('.sticker-model').fadeIn();
			$('.sticker-model').find('.model-header').html(all_aims[aim_id].name);
			$('.sticker-model').find('.model-text').html(aim_text);
			$('.sticker-model .aims_choices').show();
			$('.sticker-model .drives_choices').hide();
			
			$('input[name="aim_id"]').val(aim_id);
			if(jQuery.inArray(aim_id,checkedAims)>=0){
				$('input[name="aim_status"]').each(function(){
					if($(this).val()==all_aims[aim_id].status)
						$(this).prop('checked',true);
				});
			}else{
				$('input[name="aim_status"]').prop('checked',false);
			}
		});
		$('#modal-wrapper').click(function(){
			$('.sticker-model').fadeOut();
			$(this).hide();
		});
		$('input[name="aim_status"]').click(function(){
			var aim_id = $('input[name="aim_id"]').val();
			$('input[data-aim-checkbox="'+aim_id+'"]').val(all_aims[aim_id].status);
					

			if($(this).val()==1){
				if(checkedAims.length==3){
					$('#aims_alert').show();
					setTimeout(function(){
						$('#aims_alert').fadeOut();
					},5000);
				}else{
					$('input[data-aim-checkbox="'+aim_id+'"]').prop('checked',true);
				
				}
			}else{
				$('input[data-aim-checkbox="'+aim_id+'"]').prop('checked',false);
			}
			
			$('.sticker-model').fadeOut();
			$('#modal-wrapper').hide();
			updateAimsList();
		});
		
		$('#close_model').click(function(){
			$('.sticker-model').fadeOut();
			$('#modal-wrapper').hide();
		});
		
		$('.sticker_drive_status').click(function(){
			var drive_id = $('input[name="drive_id"]').val(); 
			
			switch(Number($(this).val())){
				case 0:
					$('input[name="drives_checkbox['+drive_id+']"]').prop('checked',false);
				break;
				case 1:
				case 2:
					if( ($(this).val()==1 &&  checkedDrives.primary.length==3) || ($(this).val()==2 && checkedDrives.secondary.length==3)  ){
						$('#drives_alert').show();
						setTimeout(function(){
							$('#drives_alert').fadeOut();
						},5000);						
					}else{
						$('input[name="drives_checkbox['+drive_id+']"]').prop('checked',false);
						$('input[name="drives_checkbox['+drive_id+']"][value="'+$(this).val()+'"]').prop('checked',true);
					}
				break;
			}
			
			$('.sticker-model').fadeOut();
			$('#modal-wrapper').hide();
			updateDrivesList();
		});
		$('.drives_info').click(function(){
			var drive_id= $(this).attr('data-drive-id');
			drive_text = $(this).attr('data-text');
			$('.sticker-model').fadeIn();
			$('#modal-wrapper').css('width',$(window).width()).css('height',$(window).height()).show();
			$('.sticker-model').find('.model-header').html(all_drives[drive_id].name);
			$('.sticker-model').find('.model-text').html(drive_text);
			$('.sticker-model .aims_choices').hide();
			$('.sticker-model .drives_choices').show();
			
			$('input[name="drive_id"]').val(drive_id);
			if(jQuery.inArray(drive_id,checkedDrives.primary)>=0){
				$('.sticker_drive_status[value="1"]').prop('checked',true);
			}else if(jQuery.inArray(drive_id,checkedDrives.secondary)>=0){
				$('.sticker_drive_status[value="2"]').prop('checked',true);
			}else{
				$('.sticker_drive_status[value="0"]').prop('checked',true);
			}
		});
		
		
		$('.aims_checkbox').click(function(){
			if( $(this).prop('checked') && checkedAims.length==3 ) {
				$('#aims_alert').show();
				setTimeout(function(){
					$('#aims_alert').fadeOut();
				},5000);
				$(this).prop('checked',false);
				return false;
			}
			updateAimsList();
		});
		
		$('.drives_checkbox').click(function(){
			if($(this).prop('checked')){
				if( ($(this).val()==1 &&  checkedDrives.primary.length==3) || ($(this).val()==2 && checkedDrives.secondary.length==3)  ){
					$('#drives_alert').show();
					setTimeout(function(){
						$('#drives_alert').fadeOut();
					},5000);
					$(this).prop('checked',false);
					
					return false;
				}
				
				$('.drives_checkbox[name="'+$(this).attr('name')+'"][value='+( $(this).val()==1?2:1 )+']').prop('checked',false);
			}
			updateDrivesList();
		});
		function calculate_chart(svgID,width,height,labelSize='1em'){
			
			if($(window).width()<560){
				labelSize='0.8em';
			}
			$('#svg1').find('.chart-triangle').remove();
			$('#svg1').find('text[class!="text-constant"]').remove();
			
			if(checkedDrives.primary.length!=3)
				return false;
			
			primary_labels=[];
			
			var points=[];
			
			for(var i in checkedDrives.primary){
				var drive_id = checkedDrives.primary[i];
				//$('#l_'+drive_id).css('color','#58000a').show();
				var x = all_drives[drive_id].x;
				var y = all_drives[drive_id].y
				
				x = Number(x.substring(0,x.length-1));
				x = Math.floor(x*width/100);
				y = Number(y.substring(0,y.length-1));
				y = Math.floor(y*height/100); 
				
				points.push( x + ',' +  y );
				
				var label = document.createElementNS('http://www.w3.org/2000/svg','text');
				label.innerHTML = all_drives[drive_id].name; 
				label.setAttribute('fill','#58000a');
				
				label.setAttribute('font-size',labelSize);
				label.setAttribute('font-weight','bold');
				@if(config('app.locale')=='en')
					label.setAttribute('font-family','scrappy-looking');
				@else
					label.setAttribute('font-family','inherit');
				@endif
				label.setAttribute('x',$('#l_'+drive_id).css('left')); 
				label.setAttribute('y',$('#l_'+drive_id).css('top'));
				$(svgID).prepend(label);
				
				primary_labels.push(all_drives[drive_id].name);
			}
			
			let triangle =  document.createElementNS('http://www.w3.org/2000/svg','polygon');
			triangle.setAttribute('class','chart-triangle');
			triangle.setAttribute('points',points.join(' '));
			triangle.setAttribute("fill", "url(#diagonalHatch)")
			triangle.setAttribute("stroke-width", "0")
			$(svgID).prepend(triangle);
			
			for(var i in checkedDrives.secondary){
				var drive_id = checkedDrives.secondary[i];
				//$('#l_' + drive_id).css('color','#000').show();
				var label = document.createElementNS('http://www.w3.org/2000/svg','text');
				label.innerHTML = all_drives[drive_id].name; 
				label.setAttribute('fill','#000');
				label.setAttribute('font-size',labelSize);
				@if(config('app.locale')=='en')
					label.setAttribute('font-family','scrappy-looking');
				@else
					label.setAttribute('font-family','inherit');
				@endif
				label.setAttribute('fill-opacity','1');
				label.setAttribute('font-weight','bold');
				label.setAttribute('x',$('#l_'+drive_id).css('left')); 
				label.setAttribute('y',$('#l_'+drive_id).css('top'));
				$('#svg1').prepend(label);
				
				secondary_labels.push(all_drives[drive_id].name);
			}
			
		}
		function updateLabels(){
			
			for(var i in checkedAims){
				var aim_id=checkedAims[i]; 
				aims_labels.push(all_aims[aim_id].name);
			}
			
			$('#primaryDrivesLabel').html(primary_labels.join(', '));
			$('#secondaryDrivesLabel').html(secondary_labels.join(', '));
			$('#aimsLabel').html(aims_labels.join(', '));
		}
		
		
		$('button[name="reset"]').click(function(){
			$('#form-board').show();
			$('#score-board').hide();
			
			$('#triangle').remove();
			$('.chart_label').hide();
			$('.drives_checkbox').prop('checked',false);
			$('.aims_checkbox').prop('checked',false);
			$('input[name="name"]').prop('disabled',false)
			primary_labels=[];
			secondary_labels=[];
			aims_labels=[];
			checkedAims=[];
			checkedDrives={primary:[],secondary:[]};
			return false;
		});
		$('input[name="result"]').click(function(){
			
 			if(checkedDrives.primary.length<3){
				$('#drives_alert2').show();
				setTimeout(function(){
					$('#drives_alert2').fadeOut();
				},3000);
				return false;
			}
			
			if($('input[name="name"]').val()==""){
				$('input[name="name"]').removeClass('name-input').addClass('input-error').focus();
				return false;
			}
			$('#form-board').hide();
			$('#score-board').show();
			
			$('input[name="name"]').prop('disabled',true).removeClass('input-error').addClass('name-input');;
			
			calculate_chart('#svg1',cvgWidth,cvgHeight);
			updateLabels();
			renderedImage = renderSVG(275,275);
			
			var dataObj = {
				name:$('input[name="name"]').val(),
				aims:checkedAims,
				drives:checkedDrives,
				chartImage:renderedImage.toDataURL(),
				_token:"{{ csrf_token() }}"
			};
			
			sendAjaxRequest(dataObj)
			//$('.log').append('test')
				
			return false;
		});
		function view_chart(){
			if( checkedDrives.primary.length==3){
				$('#form-board').hide();
				$('#score-board').show();
				$('input[name="name"]').prop('disabled',true)
				calculate_chart('#svg1',cvgWidth,cvgHeight);
				updateLabels();
			}
			
			
			
		}
		function sendAjaxRequest(_data={}){
			$.ajax({
				type:'POST',
				url:'/mindhub-test/store',
				dataType:"JSON",
				data:_data,
				success:function(response){
					if(response.status=='success'){
						scoreBoardID = response.id;
						fbURL = 'http://www.facebook.com/sharer.php?u={{ config("app.url") }}/db/'+scoreBoardID+' &t={{__("Analyse yourself and others today")}}';
						twitterURL = 'http://twitter.com/share?text={{__("Analyse yourself and others today")}}&url={{ config("app.url") }}/db/'+scoreBoardID;
						$('.fb-share-link').attr('href',fbURL);
						$('.twitter-share-link').attr('href',twitterURL);
					}
				}
			});
		}
		
		@if(isset($testerData->drives->primary))
			
			@if(isset($testerData->aims))
				@foreach($testerData->aims as $aim)
					checkedAims.push( {{ $aim }} ); 
				@endforeach
			@endif 
			
			@foreach($testerData->drives->primary as $drive)
				checkedDrives.primary.push( {{ $drive }} ); 
			@endforeach
			@if(isset($testerData->drives->secondary))
				@foreach($testerData->drives->secondary as $drive)
					checkedDrives.secondary.push( {{ $drive }} ); 
				@endforeach
			@endif
			view_chart();
		@endif;
		@if($pdf)
			imageWidth = Math.floor(60*cvgWidth/100);
			renderedImage = renderSVG(imageWidth,imageWidth);
			$('#svg1').remove(); 
			$('.report_chart').html('<center><img src="'+renderedImage.toDataURL()+'" /></center>');
			var content = document.getElementById('page-board');
			html2pdf().from(content).set({
			  margin: 1,
			  filename: $('.name-input').val() + ' {{__("Score Board")}}.pdf',
			  html2canvas: { scale: 2 },
			  jsPDF: {orientation: 'portrait', unit: 'in', format: 'letter', compressPDF: true}
			}).save();
			$('.test-container').hide();
		@endif
		
		
		
    }());