$(document)
		.ready(
				function() {

					$("[class=metricoption]")
							.change(
									function() {
										var totalPercentage = parseInt($(
												"[name=oppertunitypercent]")
												.val())
												+ parseInt($(
														"[name=bugpercent]")
														.val())
												+ parseInt($(
														"[name=testpercent]")
														.val())
												+ parseInt($(
														"[name=setuppercent]")
														.val());
										if (totalPercentage != 100) {
											$("#metricscalculation")
													.html(
															"<div id=\"metricscalculation_red\">Total percentage = "
																	+ totalPercentage
																	+ "%. Please adjust it to 100%.</div>");
										} else {
											$("#metricscalculation").html(
													"Percentage = "
															+ totalPercentage
															+ "%");
										}
									});
				});
